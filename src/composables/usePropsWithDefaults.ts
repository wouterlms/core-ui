import { computed } from 'vue'

export default <O, T>(defaultProps: O, props: T) => {
  const toCamelCase = (s: string) => s.replace(/-./g, (x) => x[1].toUpperCase())

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const camelizeObject = <T extends Record<any, any>>(obj: T): T => {
    const o: Record<string, unknown> = {}

    Object.entries(obj).forEach(([ k, v ]) => {
      o[toCamelCase(k)] = v
    })

    return o as T
  }

  const propsWithDefaults = computed(() => ({
    ...defaultProps,
    ...camelizeObject<T>(props),
  }))

  return propsWithDefaults
}
