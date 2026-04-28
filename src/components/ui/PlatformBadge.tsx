const PLATFORM_LABELS: Record<string, string> = {
  'claude-code':    'Claude Code',
  'cursor':         'Cursor',
  'codex':          'Codex',
  'windsurf':       'Windsurf',
  'vscode-copilot': 'VS Code Copilot',
  'cowork':         'Cowork',
  'gemini':         'Gemini',
  'openclaw':       'OpenClaw',
  'web':            'Web',
}

interface PlatformBadgeProps {
  platform: string
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const label = PLATFORM_LABELS[platform] ?? platform
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-scale-xs font-mono bg-surface-2 border border-border-faint text-text-3">
      {label}
    </span>
  )
}
