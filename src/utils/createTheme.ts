import { useDarkMode, useTheme } from '@/composables'

import { CreateThemeOptions } from '@/types'

const { _extendConfig, _setIcons } = useTheme()
const { detectTheme } = useDarkMode()

export default ({ extend, darkMode }: CreateThemeOptions) => {
  const { colors, icons } = extend

  if (colors !== undefined) {
    _extendConfig(colors)
  }

  if (icons !== undefined) {
    _setIcons(icons)
  }

  if (darkMode === true) {
    detectTheme()
  }
}
