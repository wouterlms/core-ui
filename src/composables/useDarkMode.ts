import {
  ref,
  watch,
} from 'vue'

const isDark = ref(false)

export default () => {
  const setThemeValue = () => {
    isDark.value = matchMedia('(prefers-color-scheme: dark)').matches
  }

  const detectTheme = () => {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      setThemeValue()
    })

    setThemeValue()
  }

  watch(isDark, (isDark) => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')

    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  return {
    isDark,
    detectTheme,
  }
}
