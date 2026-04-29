import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ALL_CATEGORY_SLUGS } from '@/lib/categories'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.mintskills.ai'

function url(path: string, priority = 0.7, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly'): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // ─── Static pages ─────────────────────────────────────────────────────────
  entries.push(
    url('/', 1.0, 'daily'),
    url('/browse', 0.9, 'daily'),
    url('/requests', 0.7, 'daily'),
    url('/auth/login', 0.3, 'yearly'),
  )

  // ─── Category pages ────────────────────────────────────────────────────────
  for (const slug of ALL_CATEGORY_SLUGS) {
    entries.push(url(`/browse/${slug}`, 0.8, 'daily'))
  }

  // ─── Database pages (best-effort — silently skip if DB unavailable) ────────
  try {
    const supabase = await createClient()

    // Free skills
    const { data: freeSkills } = await supabase
      .from('free_skills')
      .select('title, slug, indexed_at')
      .order('indexed_at', { ascending: false })

    for (const skill of freeSkills ?? []) {
      const s = skill.slug ?? slugify(skill.title)
      entries.push({
        url: `${BASE_URL}/listing/free/${s}`,
        lastModified: skill.indexed_at ? new Date(skill.indexed_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }

    // Verified paid listings
    const { data: listings } = await supabase
      .from('listings')
      .select('slug, mint_verified_at')
      .eq('status', 'verified')
      .order('mint_verified_at', { ascending: false })

    for (const listing of listings ?? []) {
      entries.push({
        url: `${BASE_URL}/listing/${listing.slug}`,
        lastModified: listing.mint_verified_at ? new Date(listing.mint_verified_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  } catch {
    // DB unavailable at build time — skip dynamic entries
  }

  return entries
}
