export type ColorGroups = 'colors' | 'textColor' | 'backgroundColor' | 'borderColor'

export type Color = string | [string, string]

export interface Colors extends Record<ColorGroups, Record<string, Color>> {
  colors: {
    accentPrimary: Color
    success: Color
    warning: Color
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

export type ColorConfig = Partial<{ [K in keyof Colors]: K extends 'colors'
  ? Partial<Colors[K]> & Record<string, string | [string, string]>
  : Partial<Colors[K]>
}>

export interface CreateThemeOptions {
  extend: {
    colors?: ColorConfig
    icons?: Record<string, string>
  }
  darkMode?: boolean
}
