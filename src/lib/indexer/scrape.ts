/**
 * Free skills indexer — pulls SKILL.md files from public GitHub repos and
 * upserts them into the free_skills Supabase table.
 *
 * Run with: npm run index-skills
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Rate limit: 60 unauthenticated requests/hour — 1-second delay between calls.
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { classify } from './classify'

// ─── Config ────────────────────────────────────────────────────────────────

const REPOS = [
  'anthropics/skills',
  'vercel-labs/agent-skills',
  'affaan-m/everything-claude-code',
  'addyosmani/agent-skills',
  'ComposioHQ/awesome-claude-skills',
]

const GITHUB_API = 'https://api.github.com'
const DELAY_MS = 1100 // 1.1s to stay comfortably under rate limit

// ─── Types ──────────────────────────────────────────────────────────────────

interface GithubContent {
  name: string
  path: string
  type: 'file' | 'dir'
  download_url: string | null
}

interface GithubRepo {
  stargazers_count: number
  pushed_at: string
}

interface FreeSkillRow {
  title: string
  description: string
  category: string
  repo_url: string
  skill_name: string
  github_stars: number
  indexed_at: string
  slug: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function githubFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${GITHUB_API}${path}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    if (!res.ok) {
      console.warn(`  GitHub ${res.status} for ${path}`)
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    console.warn(`  Fetch error for ${path}:`, err)
    return null
  }
}

/**
 * Minimal frontmatter parser — handles name: and description: fields.
 * Expects YAML frontmatter between --- delimiters (optional).
 */
function parseFrontmatter(content: string): { name: string; description: string } {
  const fm: Record<string, string> = {}
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const fmBlock = fmMatch ? fmMatch[1] : content.slice(0, 500)

  for (const line of fmBlock.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)/)
    if (m) fm[m[1].toLowerCase()] = m[2].trim().replace(/^["']|["']$/g, '')
  }

  // Fallback: first H1 heading for name, first paragraph for description
  const h1 = content.match(/^#\s+(.+)/m)
  const para = content.match(/\n\n([^#\n].{10,})/)?.[1]?.slice(0, 200)

  return {
    name: fm['name'] ?? fm['title'] ?? h1?.[1] ?? 'Unnamed Skill',
    description: fm['description'] ?? fm['summary'] ?? para ?? '',
  }
}

/**
 * Recursively find all SKILL.md files in a repo's contents tree.
 */
async function findSkillFiles(repo: string, path = ''): Promise<GithubContent[]> {
  await sleep(DELAY_MS)
  const contents = await githubFetch<GithubContent[]>(
    `/repos/${repo}/contents/${path}`
  )
  if (!contents || !Array.isArray(contents)) return []

  const results: GithubContent[] = []
  for (const item of contents) {
    if (item.type === 'file' && item.name.toUpperCase() === 'SKILL.MD') {
      results.push(item)
    } else if (item.type === 'dir') {
      const nested = await findSkillFiles(repo, item.path)
      results.push(...nested)
    }
  }
  return results
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  let indexed = 0
  const skipped = 0
  let errors = 0

  for (const repo of REPOS) {
    console.log(`\nScanning ${repo}…`)

    // Fetch repo metadata for stars and last push
    await sleep(DELAY_MS)
    const repoMeta = await githubFetch<GithubRepo>(`/repos/${repo}`)
    const stars = repoMeta?.stargazers_count ?? 0

    // Find all SKILL.md files
    const skillFiles = await findSkillFiles(repo)
    console.log(`  Found ${skillFiles.length} SKILL.md file(s)`)

    for (const file of skillFiles) {
      try {
        if (!file.download_url) continue

        // Fetch raw content
        await sleep(DELAY_MS)
        const res = await fetch(file.download_url)
        if (!res.ok) {
          console.warn(`  Could not fetch ${file.path} — ${res.status}`)
          errors++
          continue
        }
        const content = await res.text()
        const { name, description } = parseFrontmatter(content)
        const category = classify(name, description)
        const repoUrl = `https://github.com/${repo}`

        const row: FreeSkillRow = {
          title: name,
          description,
          category,
          repo_url: repoUrl,
          skill_name: name,
          github_stars: stars,
          indexed_at: new Date().toISOString(),
          slug: slugify(name),
        }

        // Upsert — skip if repo_url + skill_name already exists
        const { error } = await supabase
          .from('free_skills')
          .upsert(row, { onConflict: 'repo_url,skill_name', ignoreDuplicates: false })

        if (error) {
          console.warn(`  DB error for "${name}": ${error.message}`)
          errors++
        } else {
          console.log(`  ✓ Indexed "${name}" from ${repo} — ${category}`)
          indexed++
        }
      } catch (err) {
        console.warn(`  Unexpected error processing ${file.path}:`, err)
        errors++
      }
    }
  }

  console.log(`\n─────────────────────────────────`)
  console.log(`Indexed: ${indexed}  Skipped: ${skipped}  Errors: ${errors}`)
  console.log(`─────────────────────────────────`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
