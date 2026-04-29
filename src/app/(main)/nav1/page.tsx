'use client'

import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function Nav1Page() {
  return (
    <div className="flex flex-col gap-4">
      <Title level={3}>导航栏一</Title>
      <Paragraph type="secondary">
        这里是导航栏一的占位内容。你可以在此处开发具体的业务模块。
      </Paragraph>
    </div>
  )
}
