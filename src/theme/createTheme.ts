import { watchEffect } from 'vue'
import { useDarkMode } from '@/composables'
import { ColorConfig } from '@/types'

import { extendColors, setCssVariables } from './utils'

interface Options {
  enableDarkMode: boolean
  icons: Record<string, string>
  colors: ColorConfig
}

const { detectTheme } = useDarkMode()

export default ({ enableDarkMode, colors }: Options): void => {
  if (enableDarkMode) {
    detectTheme()
  }

  extendColors(colors)

  watchEffect(() => {
    setCssVariables()
  })
}
