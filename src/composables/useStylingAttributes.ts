import {
  HTMLAttributes,
  computed,
  useAttrs,
} from 'vue'

export default () => {
  const attrs = useAttrs()

  const nonStylingAttrs = computed(() => ({
    ...attrs,
    class: undefined,
    style: undefined,
  }))

  const stylingAttrs = computed(() => {
    const { style, class: className } = attrs

    return {
      style,
      class: className,
    } as {
      style: HTMLAttributes['style']
      class: HTMLAttributes['class']
    }
  })

  return {
    nonStylingAttrs,
    stylingAttrs,
  }
}
