'use client'

import { Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function Nav2Page() {
  return (
    <div className="flex flex-col gap-4">
      <Title level={3}>导航栏二</Title>
      <Paragraph type="secondary">
        这里是导航栏二的占位内容。你可以在此处开发具体的业务模块。
      </Paragraph>
    </div>
  )
}
