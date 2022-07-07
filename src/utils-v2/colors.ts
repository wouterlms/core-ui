import { Colors } from '@/types'

const colors: Colors = {
  accent: {
    primary: '#232323',
    success: '#43b581',
    warning: '#e6a23c',
    error: '#f56c6c',
    danger: '#f56c6c',
  },

  gray: {
    primary: [ '#d1d1d6', '#3a3a3c' ],
    secondary: [ '#c7c7cc', '#48484a' ],
    tertiary: [ '#aeaeb2', '#636366' ],
    quaternary: '#8e8e93',
  },

  text: {
    primary: [ '#272c33', '#ffffff' ],
    secondary: [ '#5b6573', '#d6d6d6' ],
    tertiary: [ '#718096', '#969696' ],

    input: [ '#606266', '#eeeeee' ],
    inputDisabled: [ '#c0c4cc', '#686868' ],
    inputPlaceholder: [ '#c0c4cc', '#585858' ],
  },

  background: {
    primary: [ '#ffffff', '#1C1C1E' ],
    secondary: [ '#F8F9FD', '#2C2C2E' ],
    tertiary: [ '#EFEFF4', '#3A3A3C' ],

    input: [ '#ffffff', '#18191c' ],
    inputDisabled: [ '#f5f7fa', '#1f2024' ],

    switch: [ '#dddfe6', '#39383c' ],
  },

  border: {
    primary: [ '#dcdfe6', '#343539' ],
    secondary: [ '#e4e7ed', '#2f3034' ],
    tertiary: [ '#ebeef5', '#2A2B2F' ],

    input: [ '#dcdfe6', '#0a0a0a' ],
  },
}

export default colors
