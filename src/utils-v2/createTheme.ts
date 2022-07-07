import { computed, reactive, watchEffect } from 'vue'

import { useDarkMode } from '@/composables'
import { ColorConfig, ColorGroups, Colors } from '@/types'

import baseColors from './colors'

interface Options {
  enableDarkMode: boolean
  icons: Record<string, string>
  colors: ColorConfig
}

const { isDark, detectTheme } = useDarkMode()

const extendedColors = reactive(baseColors)

export const test = computed(
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

export const colors = reactive(test.value)

const extendConfig = (colorConfig: ColorConfig): void => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  Object.entries(colorConfig).forEach(([ key, values ]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (extendedColors as any)[key] = {
      ...extendedColors[key as ColorGroups],
      ...values,
    }
  })
}

export const camelCaseToKebabCase = (str: string): string => (
  str.split('').map((letter, idx) => (letter.toUpperCase() === letter
    ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
    : letter)).join('')
)

const setCssVariables = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = document.querySelector(':root') as HTMLElement

  if (root == null) {
    throw Error(':root selector not found')
  }

  const index = isDark.value ? 1 : 0

  Object.entries(colors.value).forEach(([ colorGroup, currentColors ]) => {
    const groupMap = {
      accent: 'accent-',
      gray: 'gray-',
      text: 'text-',
      background: 'bg-',
      border: 'border-',
    }

    const prefix = groupMap[colorGroup as keyof typeof groupMap]

    Object.entries(currentColors).forEach(([ colorKey, colorValue ]) => {
      const color = Array.isArray(colorValue) ? colorValue[index] : colorValue

      root.style.setProperty(`--${prefix}${camelCaseToKebabCase(colorKey)}`, color)
    })
  })
}

export const createTheme = ({ enableDarkMode, colors }: Options): void => {
  if (enableDarkMode) {
    detectTheme()
  }

  extendConfig(colors)
}

watchEffect(() => {
  setCssVariables()
})
