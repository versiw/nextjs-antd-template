'use client'

import { Button, DatePicker, Space, Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg rounded-lg border border-solid border-gray-200 bg-white p-8 shadow-sm">
        <Space direction="vertical" size="large" className="w-full">
          <header>
            <Title level={2}>Ant Design 6 + Next.js 启动模板</Title>
            <Paragraph type="secondary">
              全局主题与 Provider 已配置完毕。所有 AntD
              组件都将遵循统一的样式与行为。
            </Paragraph>
          </header>

          <section className="flex flex-col gap-4">
            <p>这是一个使用了全局主题配置的按钮：</p>
            <Space wrap>
              <Button type="primary">Primary Button</Button>
              <Button>Default Button</Button>
              <Button type="dashed">Dashed Button</Button>
              <Button type="text">Text Button</Button>
              <Button type="link">Link Button</Button>
            </Space>
          </section>

          <section className="flex flex-col gap-4">
            <p>日期选择器（已集成 Day.js 并本地化为中文）：</p>
            <DatePicker />
          </section>
        </Space>
      </div>
    </main>
  )
}
