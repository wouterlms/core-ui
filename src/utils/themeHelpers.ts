import { ColorGroups } from '../types/Theme.d'

export const isTwColor = (color: string) => (
  !color.startsWith('#') && !color.startsWith('rgb')
)

export const kebabCaseToCamelCase = (str: string) => {
  const arr = str.split('-')
  const capital = arr.map((item, index) => (
    index !== 0
      ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      : item.toLowerCase()
  ))
  const capitalString = capital.join('')

  return capitalString
}

export const camelCaseToKebabCase = (str: string) => (
  str.split('').map((letter, idx) => (letter.toUpperCase() === letter
    ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
    : letter)).join('')
)

export const prefixMap: Record<'text' | 'bg' | 'border', string> = {
  text: 'textColor',
  bg: 'backgroundColor',
  border: 'borderColor',
}

export const groupNamePrefixMap: Record<ColorGroups, string> = {
  colors: '',
  textColor: 'text-',
  backgroundColor: 'bg-',
  borderColor: 'border-',
}
