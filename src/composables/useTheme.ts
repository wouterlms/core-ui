import { computed, reactive, watch } from 'vue'

import {
  camelCaseToKebabCase,
  groupNamePrefixMap,
  isTwColor,
  kebabCaseToCamelCase,
  prefixMap,
} from '@/utils/themeHelpers'

import { ColorConfig, ColorGroups, Colors } from '@/types'

import useDarkMode from './useDarkMode'
import '../styles/tailwind.scss'

const { isDark } = useDarkMode()

const colors: Colors = reactive({
  colors: {
    accentPrimary: '#4343e0',
    success: '#43b581',
    warning: '#e6a23c',
    error: '#f56c6c',
    danger: '#f56c6c',

    grayPrimary: [ '#f5f6fc', '#1c1d20' ],
    graySecondary: [ '#e1e2e8', '#212225' ],
    grayTertiary: [ '#b8b9be', '#26272a' ],
    grayQuaternary: [ '#9c9c9c', '#2b2c2f' ],
  },
  textColor: {
    primary: [ '#272c33', '#ffffff' ],
    secondary: [ '#5b6573', '#d6d6d6' ],
    tertiary: [ '#718096', '#969696' ],

    input: [ '#606266', '#eeeeee' ],
    inputDisabled: [ '#c0c4cc', '#686868' ],
    inputPlaceholder: [ '#c0c4cc', '#585858' ],
  },
  backgroundColor: {
    primary: [ '#ffffff', '#18191c' ],
    secondary: [ '#fcfcfe', '#1d1e21' ],
    tertiary: [ '#F8F9FD', '#212326' ],

    input: [ '#ffffff', '#18191c' ],
    inputDisabled: [ '#f5f7fa', '#1f2024' ],

    switch: [ '#dddfe6', '#39383c' ],
  },
  borderColor: {
    primary: [ '#dcdfe6', '#343539' ],
    secondary: [ '#e4e7ed', '#2f3034' ],
    tertiary: [ '#ebeef5', '#2A2B2F' ],

    input: [ '#dcdfe6', '#0a0a0a' ],
  },
})

let icons: Record<string, string> = {}

const setCssVariables = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = document.querySelector(':root') as HTMLElement

  if (root == null) {
    throw new Error(':root selector not found')
  }

  const index = isDark.value ? 1 : 0

  Object.entries(colors).forEach(([ colorGroup, currentColors ]) => {
    const prefix = groupNamePrefixMap[colorGroup as ColorGroups]

    Object.entries((currentColors)).forEach(([ colorKey, colorValue ]) => {
      const color = Array.isArray(colorValue) ? colorValue[index] : colorValue

      root.style.setProperty(`--${prefix}${camelCaseToKebabCase(colorKey)}`, color)
    })
  })
}

watch([ isDark, colors ], () => {
  // setCssVariables()
}, { immediate: true })

export default () => {
  const activeColors = computed(() => {
    const activeColorMap: Record<string, Record<string, string>> = {}
    const index = isDark.value ? 1 : 0

    Object.entries(colors).forEach(([ colorGroup, currentColors ]) => {
      activeColorMap[colorGroup] = {}

      Object.entries((currentColors)).forEach(([ colorKey, colorValue ]) => {
        const color = Array.isArray(colorValue) ? colorValue[index] : colorValue
        activeColorMap[colorGroup][colorKey] = color
      })
    })

    return activeColorMap as { [K in keyof Colors]: Record<keyof Colors[K], string> }
  })

  const getThemeColor = (color: string): string => {
    if (!isTwColor(color)) {
      return color
    }

    const [ prefix ] = color.split('-')

    const mappedPrefix = prefixMap[prefix as keyof typeof prefixMap] ?? null

    if (mappedPrefix === null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (activeColors.value as any).colors[kebabCaseToCamelCase(color)]
    }

    const colorNameWithoutPrefix = color.split('-').slice(1).join('-')

    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/strict-boolean-expressions
    return (activeColors.value as any)[mappedPrefix][kebabCaseToCamelCase(colorNameWithoutPrefix)]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      || (activeColors.value as any).colors[kebabCaseToCamelCase(colorNameWithoutPrefix)]
  }

  const extendConfig = (colorConfig: ColorConfig) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Object.entries(colorConfig).forEach(([ key, values ]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (colors as any)[key] = {
        ...colors[key as ColorGroups],
        ...values,
      }
    })
  }

  const setIcons = (newIcons: Record<string, string>) => {
    icons = newIcons
  }

  return {
    colors: activeColors,
    getThemeColor,
    _icons: icons,
    _extendConfig: extendConfig,
    _setIcons: setIcons,
  }
}
