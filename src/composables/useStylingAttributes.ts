import {
  HTMLAttributes,
  computed,
  useAttrs,
} from 'vue'

interface StylingAttrs {
  style: HTMLAttributes['style']
  class: HTMLAttributes['class']
}

export default () => {
  const attrs = useAttrs()

  const nonStylingAttrs = computed(() => ({
    ...attrs,
    class: undefined,
    style: undefined,
  }))

  const stylingAttrs = computed<StylingAttrs>(() => {
    const { style, class: className } = attrs

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return {
      style,
      class: className,
    } as StylingAttrs
  })

  return {
    nonStylingAttrs,
    stylingAttrs,
  }
}
