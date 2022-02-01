import {
  computed,
  reactive,
  watch,
} from 'vue'
import useDarkMode from './useDarkMode'

import '../styles/tailwind.scss'

type ColorGroups = 'colors' | 'textColor' | 'backgroundColor' | 'borderColor'

type Color = string | [string, string]

interface Colors extends Record<ColorGroups, Record<string, Color>> {
  colors: {
    accentPrimary: Color
    success: Color
    error: Color
    danger: Color

    grayPrimary: Color
    graySecondary: Color
    grayTertiary: Color
    grayQuaternary: Color
  }
  textColor: {
    primary: Color
    secondary: Color
    tertiary: Color

    input: Color
    inputDisabled: Color
    inputPlaceholder: Color
  }
  backgroundColor: {
    primary: Color
    secondary: Color
    tertiary: Color

    input: Color
    inputDisabled: Color

    switch: Color
  }
  borderColor: {
    primary: Color
    secondary: Color
    tertiary: Color

    input: Color
  }
}

type ColorConfig = Partial<{ [K in keyof Colors]: K extends 'colors'
  ? Partial<Colors[K]> & Record<string, string | [string, string]>
  : Partial<Colors[K]>
}>

interface Settings {
  enableDarkMode?: boolean
  config?: {
    colors?: ColorConfig
    icons?: Record<string, string>
  }
}

const config: Colors = reactive({
  colors: {
    accentPrimary: '#4343e0',
    success: '#43b581',
    error: '#f56c6c',
    danger: '#f56c6c',

    grayPrimary: [ '#f5f6fc', '#1c1d20' ],
    graySecondary: [ '#e1e2e8', '#212225' ],
    grayTertiary: [ '#b8b9be', '#26272a' ],
    grayQuaternary: [ '#9c9c9c', '#2b2c2f' ],
  },
  textColor: {
    primary: [ '#595f66', '#ffffff' ],
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
const { isDark, detectTheme } = useDarkMode()

const camelCaseToKebabCase = (
  str: string
) => str.split('').map((letter, idx) => (letter.toUpperCase() === letter
  ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
  : letter)).join('')

const groupNamePrefixMap: Record<ColorGroups, string> = {
  colors: '',
  textColor: 'text-',
  backgroundColor: 'bg-',
  borderColor: 'border-',
}

const setCssVariables = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = document.querySelector(':root') as any

  if (!root) {
    throw new Error(':root selector not found')
  }

  const index = isDark.value ? 1 : 0

  Object.entries(config).forEach(([ colorGroup, colors ]) => {
    const prefix = groupNamePrefixMap[colorGroup as ColorGroups]

    Object.entries((colors)).forEach(([ colorKey, colorValue ]) => {
      const color = Array.isArray(colorValue) ? colorValue[index] : colorValue

      root.style.setProperty(`--${prefix}${camelCaseToKebabCase(colorKey)}`, color)
    })
  })
}

watch([ isDark, config ], () => {
  setCssVariables()
}, { immediate: true })

export default () => {
  const prefixMap: Record<'text' | 'bg' | 'border', string> = {
    text: 'textColor',
    bg: 'backgroundColor',
    border: 'borderColor',
  }

  const kebabCaseToCamelCase = (str: string) => {
    const arr = str.split('-')
    const capital = arr.map((item, index) => (
      index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()))
    const capitalString = capital.join('')

    return capitalString
  }

  const activeColors = computed(() => {
    const activeColors: Record<string, Record<string, string>> = {}
    const index = isDark.value ? 1 : 0

    Object.entries(config).forEach(([ colorGroup, colors ]) => {
      activeColors[colorGroup] = {}

      Object.entries((colors)).forEach(([ colorKey, colorValue ]) => {
        const color = Array.isArray(colorValue) ? colorValue[index] : colorValue
        activeColors[colorGroup][colorKey] = color
      })
    })

    return activeColors as { [K in keyof Colors]: Record<keyof Colors[K], string> }
  })

  const extendConfig = (colorConfig: ColorConfig) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Object.entries(colorConfig!).forEach(([ key, values ]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (config as any)[key] = {
        ...config[key as ColorGroups],
        ...values,
      }
    })
  }

  const isTwColor = (color: string) => !color.startsWith('#') && !color.startsWith('rgb')

  const getThemeColor = (color: string): string => {
    if (!isTwColor(color)) {
      return color
    }

    const [ prefix ] = color.split('-')

    const mappedPrefix = prefixMap[prefix as keyof typeof prefixMap]

    if (!mappedPrefix) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (activeColors.value as any).colors[kebabCaseToCamelCase(color)]
    }

    const colorNameWithoutPrefix = color.split('-').slice(1).join('-')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (activeColors.value as any)[mappedPrefix][kebabCaseToCamelCase(colorNameWithoutPrefix)]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      || (activeColors.value as any).colors[kebabCaseToCamelCase(colorNameWithoutPrefix)]
  }

  const extendTheme = ({ config: userConfig, enableDarkMode }: Settings = {
    enableDarkMode: true,
    config: {
      colors: {},
    },
  }) => {
    const { colors: userColors, icons: userIcons } = userConfig || {}

    if (userColors) {
      extendConfig(userColors)
    }

    if (userIcons) {
      icons = userIcons
    }

    if (enableDarkMode !== false) {
      detectTheme()
    }
  }

  return {
    colors: activeColors,
    icons,
    extendTheme,
    getThemeColor,
  }
}
