import { spawn } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

const CONFIG = {
  outputPrefix: 'project_context_',
  agentRulesFile: 'AGENTS.md',
  excludedDirs: [
    'node_modules',
    '.git',
    '.next',
    '.vscode',
    '.idea',
    'dist',
    'build',
    'coverage',
    'public',
    'releases',
    'tmp',
    'temp',
  ],
  excludedFiles: [
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'bun.lockb',
    '.DS_Store',
    '.env',
    '.env.local',
    '.env.development',
    '.env.production',
    'CHANGELOG.md',
    'README.md',
    'LICENSE',
  ],
  excludedExtensions: [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.webp',
    '.mp4',
    '.mov',
    '.mp3',
    '.wav',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.zip',
    '.tar',
    '.gz',
    '.7z',
    '.rar',
    '.exe',
    '.dll',
    '.bin',
    '.class',
    '.jar',
    '.o',
    '.so',
    '.eot',
    '.otf',
    '.ttf',
    '.woff',
    '.woff2',
  ],
  languageMap: {
    '.js': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'tsx',
    '.jsx': 'jsx',
    '.json': 'json',
    '.css': 'css',
    '.scss': 'scss',
    '.less': 'less',
    '.html': 'html',
    '.md': 'markdown',
  } as Record<string, string>,
}

const STRICT_MODE_HEADER = `
# ⚠️ 核心指令：在处理以下代码前必读

1. **规范优先**：下方包含的 **AGENTS.md** 是本项目开发的唯一事实来源，包含命名、架构、技术栈等核心规约。
2. **环境感知**：请优先分析项目配置（如 package.json）以确定技术版本。你训练数据中的旧版 API 可能已不再适用。
3. **回答准则**：必须严格遵守 AGENTS.md 中定义的「AI Agent 回答规范」，包括提供对比审查报告和详细的计划清单。
4. **最小改动**：严禁修改、触动与当前任务无关的任何文件、UI 布局或样式。

---
`

function getLanguage(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase()
  return CONFIG.languageMap[ext] || ''
}

function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve) => {
    let command = ''
    let args: string[] = []
    switch (process.platform) {
      case 'win32':
        command = 'powershell'
        args = [
          '-NoProfile',
          '-Command',
          `$OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::InputEncoding = [System.Text.Encoding]::UTF8; $content = [Console]::In.ReadToEnd(); Set-Clipboard -Value $content;`,
        ]
        break
      case 'darwin':
        command = 'pbcopy'
        break
      case 'linux':
        command = 'xclip'
        args = ['-selection', 'clipboard']
        break
      default:
        resolve()
    }
    const child = spawn(command, args)
    child.stdin.write(text, 'utf8')
    child.stdin.end()
    child.on('close', () => resolve())
  })
}

function generateContextForPath(targetPath: string, rootDir: string): string {
  const fullPath = path.resolve(rootDir, targetPath)
  if (!fs.existsSync(fullPath)) return ''

  const builder: string[] = []
  const readFile = (filePath: string) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      if (content.includes('\0')) return
      const relativePath = path.relative(rootDir, filePath)
      builder.push(
        `# File: ${relativePath}\n\n\`\`\`${getLanguage(filePath)}\n${content}\n\`\`\`\n---\n`,
      )
    } catch {}
  }

  const traverse = (currentPath: string) => {
    const stats = fs.statSync(currentPath)
    if (stats.isFile()) {
      readFile(currentPath)
      return
    }
    const entries = fs.readdirSync(currentPath)
    for (const entry of entries) {
      if (
        CONFIG.excludedDirs.includes(entry) ||
        CONFIG.excludedFiles.includes(entry)
      )
        continue
      const ext = path.extname(entry).toLowerCase()
      if (CONFIG.excludedExtensions.includes(ext)) continue

      const entryFullPath = path.join(currentPath, entry)
      if (fs.statSync(entryFullPath).isDirectory()) {
        traverse(entryFullPath)
      } else {
        readFile(entryFullPath)
      }
    }
  }

  traverse(fullPath)
  return builder.join('\n')
}

async function main() {
  const args = process.argv.slice(2)
  const rootDir = process.cwd()

  console.log(`\n\x1b[36m%s\x1b[0m`, ` 🛠️  AI Context Generator`)
  console.log(`\x1b[90m%s\x1b[0m`, ` -----------------------------------------`)

  let finalContent = ''

  const agentsPath = path.join(rootDir, CONFIG.agentRulesFile)
  if (fs.existsSync(agentsPath)) {
    const agentsContent = fs.readFileSync(agentsPath, 'utf8')
    finalContent = STRICT_MODE_HEADER
    finalContent += `# File: AGENTS.md (GLOBAL RULES)\n\n\`\`\`markdown\n${agentsContent}\n\`\`\`\n\n${'='.repeat(50)}\n\n`
    console.log(` \x1b[32m✔\x1b[0m 检测到规范文档: AGENTS.md (已自动置顶)`)
  }

  for (const target of args) {
    const isAgentsFile =
      target === CONFIG.agentRulesFile ||
      path.basename(target) === CONFIG.agentRulesFile
    if (isAgentsFile) continue

    console.log(` \x1b[34m•\x1b[0m 正在处理: ${target}`)
    const content = generateContextForPath(target, rootDir)
    if (content) {
      finalContent += content + `\n${'='.repeat(50)}\n\n`
    }
  }

  if (finalContent) {
    await copyToClipboard(finalContent)
    const lineCount = finalContent.split('\n').length
    console.log(
      `\x1b[90m%s\x1b[0m`,
      ` -----------------------------------------`,
    )
    console.log(
      ` \x1b[32m✨ 成功！上下文已复制到剪切板 (共 ${lineCount} 行)\x1b[0m`,
    )
    console.log(
      ` \x1b[33m👉 请粘贴至对话框，AI 将遵循项目规范进行处理。\x1b[0m\n`,
    )
  } else {
    console.log(` \x1b[31m✘\x1b[0m 未发现有效内容，请检查路径。`)
  }
}

main()
