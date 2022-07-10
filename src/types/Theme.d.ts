export type ColorGroups = 'accent' | 'gray' | 'text' | 'background' | 'border'

export type Color = string | [string, string]

export interface Colors extends Record<ColorGroups, Record<keyof ColorGroups, Color>> {
  accent: {
    primary: Color
    secondary: Color
    green: Color
    orange: Color
    red: Color
  }
  gray: {
    primary: Color
    secondary: Color
    tertiary: Color
    quaternary: Color
  }
  text: {
    primary: Color
    secondary: Color
    tertiary: Color

    input: Color
    inputDisabled: Color
    inputPlaceholder: Color
  }
  background: {
    primary: Color
    secondary: Color
    tertiary: Color

    input: Color
    inputDisabled: Color

    switch: Color
  }
  border: {
    primary: Color
    secondary: Color
    tertiary: Color

    input: Color
  }
}

export type ColorConfig = Partial<{
  [K in keyof Colors]: Partial<Colors[K]> & Record<string, string | [string, string]>
}>

export interface CreateThemeOptions {
  extend: {
    colors?: ColorConfig
    icons?: Record<string, string>
  }
  darkMode?: boolean
}
