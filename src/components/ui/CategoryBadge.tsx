import {
  Zap, Workflow, Server, Bot, MessageSquare, FileCode, Palette,
  Package, GraduationCap, Timer, FileText, BarChart3, TrendingUp,
  Search, Megaphone, ShieldCheck, Monitor, Database, FlaskConical,
  Shield, Cloud, GitBranch, BookOpen, Bug, CheckSquare, Cog,
  type LucideIcon,
} from 'lucide-react'

interface CategoryBadgeProps {
  category: string
  size?: 'sm' | 'md'
}

type CategoryEntry = { label: string; Icon: LucideIcon }

const CATEGORIES: Record<string, CategoryEntry> = {
  skill:                       { label: 'Skill',                  Icon: Zap },
  skills:                      { label: 'Skills',                 Icon: Zap },
  recipes:                     { label: 'Recipe',                 Icon: Workflow },
  mcp_servers:                 { label: 'MCP Server',             Icon: Server },
  mcp_server:                  { label: 'MCP Server',             Icon: Server },
  agent_configs:               { label: 'Agent Config',           Icon: Bot },
  agent_config:                { label: 'Agent Config',           Icon: Bot },
  prompt_libraries:            { label: 'Prompts',                Icon: MessageSquare },
  config_files:                { label: 'Config',                 Icon: FileCode },
  css_art:                     { label: 'CSS Art',                Icon: Palette },
  starter_kits:                { label: 'Starter Kit',            Icon: Package },
  courses:                     { label: 'Course',                 Icon: GraduationCap },
  cowork:                      { label: 'Cowork',                 Icon: Timer },
  cowork_productivity:         { label: 'Cowork: Productivity',   Icon: Timer },
  cowork_document_workflows:   { label: 'Cowork: Documents',      Icon: FileText },
  cowork_business_analysis:    { label: 'Cowork: Analysis',       Icon: BarChart3 },
  cowork_financial_modelling:  { label: 'Cowork: Finance',        Icon: TrendingUp },
  cowork_research:             { label: 'Cowork: Research',       Icon: Search },
  cowork_marketing:            { label: 'Cowork: Marketing',      Icon: Megaphone },
  cowork_compliance:           { label: 'Cowork: Compliance',     Icon: Shield },
  cowork_vertical_agents:      { label: 'Cowork: Vertical Agent', Icon: Bot },
  frontend:                    { label: 'Frontend',               Icon: Monitor },
  backend:                     { label: 'Backend',                Icon: Database },
  testing:                     { label: 'Testing',                Icon: FlaskConical },
  security:                    { label: 'Security',               Icon: ShieldCheck },
  devops:                      { label: 'DevOps',                 Icon: Cloud },
  git:                         { label: 'Git',                    Icon: GitBranch },
  docs:                        { label: 'Documentation',          Icon: BookOpen },
  'data-science':              { label: 'Data Science',           Icon: BarChart3 },
  debugging:                   { label: 'Debugging',              Icon: Bug },
  productivity:                { label: 'Productivity',           Icon: CheckSquare },
  automation:                  { label: 'Automation',             Icon: Cog },
  'marketing-seo':             { label: 'Marketing / SEO',        Icon: Megaphone },
}

const FALLBACK: CategoryEntry = { label: 'Skill', Icon: Zap }

const sizeConfig = {
  sm: { icon: 10, text: 'text-scale-xs', pad: 'px-2 py-0.5', gap: 'gap-1' },
  md: { icon: 12, text: 'text-scale-sm', pad: 'px-2.5 py-1', gap: 'gap-1.5' },
} as const

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const entry = CATEGORIES[category] ?? FALLBACK
  const { Icon, label } = entry
  const { icon, text, pad, gap } = sizeConfig[size]

  return (
    <span
      className={`inline-flex items-center ${gap} ${pad} ${text} bg-surface-2 border border-border-faint text-text-3 font-mono`}
    >
      <Icon size={icon} className="flex-shrink-0" />
      {label}
    </span>
  )
}
