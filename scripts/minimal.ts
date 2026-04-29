/*
 * @File path: \zoom-ai-training\scripts\minimal.ts
 * @Description: 用于打包项目的最小可运行单元，移除开发工具、脚本和冗余配置。
 */

import fs from 'node:fs'
import path from 'node:path'

// =================================================================================
// 1. 配置区域 (Configuration)
// =================================================================================

const CONFIG = {
  // 根目录（相对于脚本位置）
  rootDir: path.resolve(__dirname, '..'),

  /**
   * 📦 输出目录配置
   * 可以是相对路径（相对于根目录），例如 'minimal-export'
   * 也可以是绝对路径，例如 'D:\\codes\\minimal-export'
   */
  // targetPath: './minimal-export',
  targetPath: 'D:\\codes\\project\\nextjs-antd-template',

  // 需要排除的目录路径或名称 (相对于根目录，支持具体路径如 'src/tests')
  excludedDirs: [
    // 'scripts',
    'releases',
    // '.vscode',
    '.git',
    '.next',
    'node_modules',
    'dist',
    '.idea',
    'coverage',
    'tmp',
    'src/tests',
    'src/app/(maintenance)',
  ],

  // 需要排除的文件名称 (精确匹配)
  excludedFiles: [
    '.DS_Store',
    // '.gitignore',
    '.prettierignore',
    // 'eslint.config.mjs',
    'project_context.md',
    'CHANGELOG.md',
    'tree.txt',
    'temp.md',
    'SYSTEM_PROMPT.md',
    '.release-it.json',
    'vitest.config.ts',
    'middleware.ts',
    '.env.example',
  ],

  excludedExtensions: [],

  // Package.json 中需要移除的字段配置
  packageJson: {
    // 移除顶层字段
    removeFields: ['prettier', 'private'],

    // 移除 scripts 中的命令
    removeScripts: ['tree', 'release', 'format', 'commit', 'build:static'],

    // 移除 dependencies 或 devDependencies 中的包
    removeDeps: [
      '@versiwfekit/prettier',
      '@versiwfekit/verify-commit',
      'release-it',
      '@release-it/conventional-changelog',
      'archiver',
      'prettier',
    ],
  },
}

// =================================================================================
// 2. 核心逻辑 (Core Logic)
// =================================================================================

async function main() {
  const sourcePath = CONFIG.rootDir

  // 处理目标路径：如果是绝对路径则直接使用，如果是相对路径则拼接在 rootDir 下
  let destPath = CONFIG.targetPath
  if (!path.isAbsolute(destPath)) {
    destPath = path.join(CONFIG.rootDir, destPath)
  }

  console.log(`🚀 开始生成最小运行单元...`)
  console.log(`📂 源目录: ${sourcePath}`)
  console.log(`📦 目标目录: ${destPath}`)

  // 安全检查：防止源目录和目标目录相同
  if (path.resolve(sourcePath) === path.resolve(destPath)) {
    console.error(`❌ 错误：源目录和目标目录不能相同！`)
    process.exit(1)
  }

  // 1. 清理并创建目标目录
  if (fs.existsSync(destPath)) {
    console.log(`🧹 清理旧目录...`)
    fs.rmSync(destPath, { recursive: true, force: true })
  }
  fs.mkdirSync(destPath, { recursive: true })

  // 2. 复制文件 (带过滤)
  console.log(`📝 正在复制文件...`)

  // 递归复制函数
  const copyRecursive = (src: string, dest: string) => {
    // 防止递归死循环：如果当前要复制的文件/目录就是目标目录，则跳过
    if (path.resolve(src) === path.resolve(destPath)) {
      return
    }

    const stats = fs.statSync(src)
    const itemName = path.basename(src)

    // ✨ 获取当前项相对于根目录的路径，并统一使用正斜杠以匹配配置
    const relativeItemPath = path
      .relative(CONFIG.rootDir, src)
      .replace(/\\/g, '/')

    if (stats.isDirectory()) {
      // ✨ 检查目录名或相对路径是否在排除列表中
      if (
        CONFIG.excludedDirs.includes(itemName) ||
        CONFIG.excludedDirs.includes(relativeItemPath)
      ) {
        return
      }

      if (!fs.existsSync(dest)) fs.mkdirSync(dest)

      const entries = fs.readdirSync(src)
      for (const entry of entries) {
        copyRecursive(path.join(src, entry), path.join(dest, entry))
      }
    } else {
      if (CONFIG.excludedFiles.includes(itemName)) return

      const ext = path.extname(itemName).toLowerCase()
      if (
        CONFIG.excludedExtensions.includes(ext) &&
        itemName !== 'USER_CHANGELOG.md'
      )
        return

      fs.copyFileSync(src, dest)
    }
  }

  // 开始复制（排除目标目录自身，虽然上面的 resolve 检查已经包含，但这里作为入口检查更高效）
  const rootEntries = fs.readdirSync(sourcePath)
  for (const entry of rootEntries) {
    const fullEntryPath = path.join(sourcePath, entry)
    // 再次确认入口不等于目标目录
    if (path.resolve(fullEntryPath) === path.resolve(destPath)) continue

    copyRecursive(fullEntryPath, path.join(destPath, entry))
  }

  // 3. 处理 package.json
  console.log(`🔧 处理 package.json...`)
  const pkgPath = path.join(destPath, 'package.json')
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

    // 移除顶层字段
    CONFIG.packageJson.removeFields.forEach((field) => delete pkg[field])

    // 移除 scripts
    if (pkg.scripts) {
      CONFIG.packageJson.removeScripts.forEach(
        (script) => delete pkg.scripts[script],
      )
    }

    // 移除依赖 (检查 devDependencies 和 dependencies)
    const depsTypes = ['dependencies', 'devDependencies']
    depsTypes.forEach((type) => {
      if (pkg[type]) {
        CONFIG.packageJson.removeDeps.forEach((dep) => {
          if (pkg[type][dep]) delete pkg[type][dep]
        })
      }
    })

    // 写入处理后的 package.json
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  }

  // 4. 重写 next.config.ts
  console.log(`⚙️  重写 next.config.ts...`)
  const nextConfigPath = path.join(destPath, 'next.config.ts')

  const cleanNextConfigContent = `
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

export default nextConfig

`
  fs.writeFileSync(nextConfigPath, cleanNextConfigContent.trim())

  console.log(`\n🎉 打包完成!`)
  console.log(`👉 请检查目录: ${destPath}`)
  console.log(`💡 提示: 进入该目录运行 'npm install' 和 'npm run dev' 验证。`)
}

main().catch(console.error)
