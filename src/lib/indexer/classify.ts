/**
 * Keyword-based category classifier for free skills from GitHub.
 * Input: combined title + description string (lowercased internally).
 * Output: category slug matching the CATEGORY_LABELS keys.
 */

const RULES: [RegExp, string][] = [
  [/test|spec|jest|vitest|coverage/,                    'testing'],
  [/deploy|docker|ci\/cd|pipeline|kubernetes|helm/,     'devops'],
  [/security|auth|oauth|vulnerability|pentest/,         'security'],
  [/git|commit|\bpr\b|pull request|branch|merge/,       'git'],
  [/document|readme|changelog|api docs/,                'docs'],
  [/frontend|react|\bcss\b|\bui\b|component|tailwind/,  'frontend'],
  [/backend|\bapi\b|\brest\b|graphql|express|fastapi/,  'backend'],
  [/debug|error|trace|\blog\b/,                         'debugging'],
  [/\bsql\b|postgres|mysql|\betl\b|data pipeline/,      'data-science'],
  [/\bpython\b/,                                        'backend'],
  [/marketing|\bseo\b|content|social/,                  'automation'],
  [/productivity|planning|\btask\b/,                    'productivity'],
]

export function classify(title: string, description: string): string {
  const haystack = `${title} ${description}`.toLowerCase()
  for (const [pattern, category] of RULES) {
    if (pattern.test(haystack)) return category
  }
  return 'skill'
}
