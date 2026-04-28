export const CATEGORY_LABELS: Record<string, string> = {
  skill:                      'Skill',
  skills:                     'Skills',
  recipes:                    'Recipe',
  mcp_servers:                'MCP Server',
  agent_configs:              'Agent Config',
  prompt_libraries:           'Prompts',
  config_files:               'Config',
  css_art:                    'CSS Art',
  starter_kits:               'Starter Kit',
  courses:                    'Course',
  cowork:                     'Cowork',
  cowork_productivity:        'Cowork: Productivity',
  cowork_document_workflows:  'Cowork: Documents',
  cowork_business_analysis:   'Cowork: Analysis',
  cowork_financial_modelling: 'Cowork: Finance',
  cowork_research:            'Cowork: Research',
  cowork_marketing:           'Cowork: Marketing',
  cowork_compliance:          'Cowork: Compliance',
  cowork_vertical_agents:     'Cowork: Vertical Agent',
  frontend:                   'Frontend',
  backend:                    'Backend',
  testing:                    'Testing',
  security:                   'Security',
  devops:                     'DevOps',
  git:                        'Git',
  docs:                       'Documentation',
  debugging:                  'Debugging',
  productivity:               'Productivity',
  automation:                 'Automation',
  'data-science':             'Data Science',
  'marketing-seo':            'Marketing / SEO',
}

export const DEV_CATEGORIES = [
  'skill', 'recipes', 'mcp_servers', 'agent_configs', 'prompt_libraries',
  'config_files', 'css_art', 'starter_kits', 'courses',
  'frontend', 'backend', 'testing', 'security', 'devops',
  'git', 'docs', 'debugging', 'productivity', 'automation',
] as const

export const COWORK_CATEGORIES = [
  'cowork', 'cowork_productivity', 'cowork_document_workflows',
  'cowork_business_analysis', 'cowork_financial_modelling',
  'cowork_research', 'cowork_marketing', 'cowork_compliance',
  'cowork_vertical_agents',
] as const

export const ALL_CATEGORY_SLUGS = [
  ...DEV_CATEGORIES,
  ...COWORK_CATEGORIES,
  'data-science',
  'marketing-seo',
]

export const PLATFORMS = [
  { value: 'claude-code',   label: 'Claude Code' },
  { value: 'cursor',        label: 'Cursor' },
  { value: 'codex',         label: 'Codex' },
  { value: 'windsurf',      label: 'Windsurf' },
  { value: 'vscode-copilot',label: 'VS Code Copilot' },
  { value: 'cowork',        label: 'Cowork' },
  { value: 'gemini',        label: 'Gemini' },
  { value: 'openclaw',      label: 'OpenClaw' },
] as const
