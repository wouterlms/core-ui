import { useAttrs } from 'vue'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default () => {
  const attrs = useAttrs()

  const getListenerAttrs = (): Record<string, unknown> => {
    const onAttrs: Record<string, unknown> = {}

    Object.entries(attrs).forEach(([
      key,
      value,
    ]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        onAttrs[key] = value
      }
    })

    return onAttrs
  }

  return {
    getListenerAttrs,
  }
}
