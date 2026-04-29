'use client'

import { Layout } from 'antd'
import { Header } from './header'
import { Sidebar } from './sidebar'

const { Content } = Layout

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout hasSider className="flex-1 overflow-hidden">
      <Sidebar />
      <Layout className="overflow-hidden">
        <Header />
        <Content className="m-6 overflow-y-auto rounded-lg bg-white p-6 shadow-sm">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
