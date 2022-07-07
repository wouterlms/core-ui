import { computed } from 'vue'

import { useDarkMode } from '@/composables'
import { ColorConfig, Colors } from '@/types'

import defaultColors from './colors'

type CreateTheme = (
  settings: {
    colors: ColorConfig
    icons: Record<string, string>
    enableDarkMode: boolean
  }) => void

const { isDark, detectTheme } = useDarkMode()

detectTheme()

const activeColors = computed(
  () => {
    const activeColorMap: Record<string, Record<string, string>> = {}
    const index = isDark.value ? 1 : 0

    Object.entries(defaultColors).forEach(([ colorGroup, currentColors ]) => {
      activeColorMap[colorGroup] = {}

      Object.entries((currentColors)).forEach(([ colorKey, colorValue ]) => {
        const color = Array.isArray(colorValue) ? colorValue[index] : colorValue
        activeColorMap[colorGroup][colorKey] = color
      })
    })

    return activeColorMap as { [K in keyof Colors]: Record<keyof Colors[K], string> }
  }
)

const createTheme: CreateTheme = ({ colors, icons, enableDarkMode }) => {

}

export const colors = activeColors

// Kleuren extenden
// Iconen instellen
// Dark mode aan zetten
