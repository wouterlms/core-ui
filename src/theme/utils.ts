import { useDarkMode } from '@/composables'
import { ColorConfig, ColorGroups } from '@/types'

import { colors, extendedColors } from './colors'

const { isDark } = useDarkMode()

export const camelCaseToKebabCase = (str: string): string => (
  str.split('').map((letter, idx) => (letter.toUpperCase() === letter
    ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
    : letter)).join('')
)

export const setCssVariables = () => {
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

export const extendColors = (colorConfig: ColorConfig): void => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  Object.entries(colorConfig).forEach(([ key, values ]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (extendedColors as any)[key] = {
      ...(extendedColors)[key as ColorGroups],
      ...values,
    }
  })
}
