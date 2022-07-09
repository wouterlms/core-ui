import { computed, reactive } from 'vue'
import { useDarkMode } from '@/composables'

import { Colors } from '@/types'
import baseColors from './baseColors'

const { isDark } = useDarkMode()

export const extendedColors = reactive(baseColors)

export const colors = computed(
  () => {
    const activeColorMap: Record<string, Record<string, string>> = {}
    const index = isDark.value ? 1 : 0

    Object.entries(extendedColors).forEach(([ colorGroup, extendedColors ]) => {
      activeColorMap[colorGroup] = {}

      Object.entries((extendedColors)).forEach(([ colorKey, colorValue ]) => {
        const color = Array.isArray(colorValue) ? colorValue[index] : colorValue
        activeColorMap[colorGroup][colorKey] = color
      })
    })

    return activeColorMap as { [K in keyof Colors]: Record<keyof Colors[K], string> }
  }
)
