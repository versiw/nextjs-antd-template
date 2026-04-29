<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# 项目开发规范与 AI Agent 指南

## ⚠️ 核心背景：Next.js + Turbopack

本项目基于 **最新的 Next.js (App Router)** 开发。请注意，最新版本的 API、约定和性能优化（如 Turbopack）可能与你训练数据中的旧版本有所不同。在编写代码前，优先参考项目已有的实现模式，并遵循现代 React Server Components (RSC) 的最佳实践。

---

## 命名规范

- **文件与目录名称**：统一使用 **短横线命名法 (kebab-case)**。例如：`user-card.tsx`, `auth-provider.tsx`。
- **组件与定义名称**：文件内部导出的 React 组件、接口 (Interface)、类型 (Type) 必须使用 **大驼峰命名法 (PascalCase)**。例如：`export function UserCard()`, `interface UserConfig`。
- **变量命名**：代码内部的普通变量、函数名、属性名统一采用 **小驼峰命名法 (lowerCamelCase)**。例如：`const userData = ...`, `function fetchData()`.

---

## 类型安全与数据验证 (TypeScript & Zod)

我们追求**演进式的类型安全**，拒绝维护臃肿的单体类型文件。

### TypeScript 类型声明 (`src/types/`)

- **解耦与复用**：类型定义放在 `src/types/` 目录下。根据业务模块进行切分。
- **业务归类**：同类业务的类型应当放在一起。随着业务演进，适时进行拆分和重构，保持代码逻辑清晰。
- **引用优先**：尽可能遵循和引用现有定义，严禁重复定义相同结构的类型。在定义新类型前，应先检索 `src/types/` 下是否有可复用或可扩展的定义。
- **禁止使用 any**：尽可能显式声明所有接口与类型，充分利用 TS 的推导能力。

### 数据验证架构 (`src/schemas/`)

- **输入输出安全**：所有表单、API 请求/响应等系统边界数据，必须使用 **Zod** 进行规范化声明。
- **存储位置**：Schema 定义放在 `src/schemas/` 目录下，同样遵循解耦原则，按业务模块演进。
- **类型同步**：利用 `z.infer<T>` 从 Schema 中导出类型，确保验证逻辑与类型定义的一致性。

---

## UI 与样式规约 (Ant Design 6 + Tailwind CSS v4)

- **基础组件**：统一使用 **Ant Design 6** 提供的高质量组件作为基础。
- **样式协同 (AntD + Tailwind)**：
  - **组件形态**：复用 Ant Design 的内置 API（如 `type`, `size`, `variant` 等）控制组件的主体形态与交互。
  - **布局与微调**：使用 **Tailwind CSS v4** 处理页面布局（Flex/Grid）、间距（Margin/Padding）、排版以及响应式设计，避免编写独立的 CSS/LESS 文件。
  - **主题定制**：通过 Ant Design 的 ConfigProvider 统一定制主题 Token，不要在 Tailwind 类中硬编码与 Ant Design 冲突的颜色值。
- **样式哲学**：
  - **克制动效**：保持页面动画和动效的克制，避免过度设计。
  - **高效可靠**：追求以最高效、最简短、最可靠且易懂的代码来实现界面效果。

---

## 日期与时间处理 (Day.js)

- **唯一标准**：系统内所有的日期解析、格式化和计算**必须且仅能**使用 **Day.js**。严禁使用 `moment.js` 或直接操作原生 `Date` 对象进行复杂计算。
- **生态协同**：Ant Design 6 内部默认采用 Day.js 进行日期处理（如 DatePicker, TimePicker），在给这些组件传递或接收值时，请保持类型一致性，直接使用 Day.js 对象。

---

## 状态管理 (Zustand)

开发时需严格区分**组件内部状态**与**全局状态**。

### 全局状态管理 (`src/store/`)

- **Slice 模式**：使用 Zustand 的 Slice 模式进行 Store 的切分解耦。
- **变量冲突预防**：所有 Slice 的状态变量必须以该 Slice 的名称作为前缀（采用 **小驼峰**）。
  - _示例_：在 `authSlice` 中，变量命名为 `authStatus`, `authUser`, `authActions`。

---

## 组件开发与架构哲学

- **拒绝单体组件 (Anti-Monolithic)**：严禁编写逻辑过重、行数过多的单体大组件。当一个组件功能变得复杂时，必须遵循 React 组件哲学进行功能拆分。
- **高内聚、低耦合**：将大组件拆分为多个职责单一的小型“功能部件组件 (Feature Parts)”。
  - **拆分原则**：每个子组件应仅负责一个明确的逻辑或 UI 块（如：`UserHeader`, `UserStats`, `UserActions`）。
  - **目录组织**：对于复杂功能，建立以功能命名的目录。主组件为 `index.tsx`，局部子组件存放在同级目录下，不应随意暴露给全局 `src/components`。
- **组件复合 (Composition)**：利用组件复合（Composition）和复合组件模式（Compound Components）来组装大组件，而不是通过不断增加 Props 来控制内部逻辑。
- **服务端组件 (RSC)**：数据获取应尽可能在 Server Components 中完成，利用并行请求（`Promise.all`）消除瀑布流。
- **复杂表格**：系统中的复杂表格统一选用 **Ant Design Table** 组件，充分利用其内置的排序、筛选、分页和固定列等能力。对于超大数据量，需结合其虚拟滚动特性进行优化。

---

## 技术栈概览

- **框架**: Next.js (App Router)
- **UI**: Ant Design 6
- **CSS**: Tailwind CSS v4
- **状态**: Zustand (Slice Pattern)
- **表单验证**: Zod
- **日期处理**: Day.js

---

## AI Agent 回答规范

- **对比审查报告**：在提供代码前，先输出一份简单的对比列表，说明修改点对原生逻辑的影响评估。
- **计划清单**：列出详细的修改/新增文件清单及操作步骤。
- **环境保全(必须严格执行该要求)**：不得触动与本次修改无关的文件、业务代码或 UI 样式，确保系统整体稳定性。
- **架构合理性**：遵循现有设计模式，严禁重复定义。代码必须放置在符合其职责的目录/文件中。
- **Skill 运用**：若上下文中提供了相关的 `skills` 描述，请识别并应用最匹配的技术栈/算法（如充分利用 Ant Design 6 的最新 API 替代手写逻辑）。
- **完整代码交付**：提供受影响文件的**全量代码**，确保直接替换可用，注释清晰且符合工程规范。

---

## 文档维护准则

- **增量修改**：对 `AGENTS.md` 的修改必须是增量的。除非明确提到相关部分的重构，否则严禁修改、删除或破坏未涉及的现有规则。
- **规则持久性**：本指南中的规约在整个项目周期内持续有效。

## 可参考访问的 LLMs.txt 聚合文件

提供有关技术的 LLMs.txt 聚合文件，如果匹配到相关技术栈的使用，可以访问对应的链接获取。

### Ant Design

阅读 https://ant.design/llms-full.txt 或 https://ant.design/llms.txt 并理解 Ant Design 组件库，在编写 Ant Design 代码时使用这些知识。

llms.txt 导航文件，包含所有文档和组件的链接 https://ant.design/llms.txt
llms-full.txt 完整的组件文档（英文），包含实现细节和示例 https://ant.design/llms-full.txt
llms-full-cn.txt 完整的组件文档（中文） https://ant.design/llms-full-cn.txt
llms-semantic.md 组件语义描述（英文），包含 DOM 结构和使用模式 https://ant.design/llms-semantic.md
llms-semantic-cn.md 组件语义描述（中文） https://ant.design/llms-semantic-cn.md
