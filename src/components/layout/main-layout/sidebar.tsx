'use client'

import { Layout, Menu } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { mainMenus } from '@/config/menu'

const { Sider } = Layout

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Sider breakpoint="lg" collapsedWidth="0" className="shadow-md">
      <div className="flex h-16 items-center justify-center border-b border-white/10 text-lg font-bold tracking-widest text-white">
        ADMIN LOGO
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={mainMenus}
        onClick={({ key }) => router.push(key)}
        className="mt-4"
      />
    </Sider>
  )
}
