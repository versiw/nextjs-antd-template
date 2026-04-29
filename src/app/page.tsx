'use client'

import { Button, Space, Typography } from 'antd'
import Link from 'next/link'

const { Title, Text } = Typography

export default function MarketingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-white overflow-hidden selection:bg-blue-50 text-zinc-900">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-[15%] top-0 w-px h-full bg-zinc-100" />
        <div className="absolute right-[15%] top-0 w-px h-full bg-zinc-100" />

        <div className="absolute top-[20%] left-0 w-full h-px bg-zinc-100" />
        <div className="absolute bottom-[20%] left-0 w-full h-px bg-zinc-100" />

        <div className="absolute top-[20%] left-[15%] w-2 h-2 border-l border-t border-zinc-300 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-[20%] right-[15%] w-2 h-2 border-r border-t border-zinc-300 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-[20%] left-[15%] w-2 h-2 border-l border-b border-zinc-300 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-[20%] right-[15%] w-2 h-2 border-r border-b border-zinc-300 translate-x-1/2 translate-y-1/2" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-[70%] w-full flex flex-col items-center text-center">
          <Space orientation="vertical" size={48} className="w-full">
            <div className="flex flex-col items-center gap-6">
              <div className="space-y-2">
                <Title className="m-0! text-5xl! md:text-7xl! font-bold! tracking-tight! text-zinc-900!">
                  Next.js 16+
                  <br />
                  <span className="text-blue-600">Ant Design v6</span>
                </Title>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/home">
                <Button
                  type="primary"
                  size="large"
                  className="h-12 px-10 text-base font-medium bg-zinc-900 hover:bg-zinc-800! border-none rounded-none"
                >
                  进入系统
                </Button>
              </Link>
              <Button
                size="large"
                className="h-12 px-10 text-base font-medium border-zinc-200 text-zinc-500 hover:text-zinc-900! hover:border-zinc-900! rounded-none"
              >
                快速开始
              </Button>
            </div>
          </Space>
        </div>
      </main>
    </div>
  )
}
