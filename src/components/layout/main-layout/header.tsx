'use client'

import { Layout, theme } from 'antd'

const { Header: AntdHeader } = Layout

export function Header() {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <AntdHeader
      style={{ background: colorBgContainer }}
      className="z-10 flex items-center px-6 shadow-sm"
    >
      <span className="font-medium text-gray-800">欢迎使用后台管理系统</span>
    </AntdHeader>
  )
}
