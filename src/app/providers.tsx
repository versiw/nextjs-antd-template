'use client'

import appTheme from '@/theme/theme.config'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'

import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={zhCN} theme={appTheme}>
      {children}
    </ConfigProvider>
  )
}
