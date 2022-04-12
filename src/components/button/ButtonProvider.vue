<script setup lang="ts">
import {
  computed,
  defineProps,
  h,
  useAttrs,
  useSlots,
  withDefaults,
} from 'vue'

import {
  RouteLocationRaw,
  RouterLink,
} from 'vue-router'

interface Props {
  /**
   * Renders a `<RouterLink>`
   */
  to?: RouteLocationRaw

  /**
   * Renders a `<a>`
   */
  href?: string,

  /**
   * Native button type, defaults to `button`
   */
  type?: string,

  /**
   * Disable button
   */
  isDisabled?: boolean,

  /**
   * Disable button
   */
  isLoading?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  href: undefined,
  type: 'button',
  isDisabled: false,
  isLoading: false,
})

const attrs = useAttrs()
const slots = useSlots()

const component = computed<typeof RouterLink | string>(() => {
  if (typeof props.to === 'string' || props.href) {
    return 'a'
  }

  return 'button'
})

const button = computed(() => {
  const {
    isLoading,
    isDisabled,
    type,
    to,
    href,
  } = props

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return h(component.value as any, {
    ...attrs,
    href,
    to,
    type: typeof to !== 'string' && !href ? type : undefined,
    disabled: isLoading || isDisabled,
    class: [ 'inline-block', props.isDisabled || props.isLoading ? 'cursor-not-allowed' : 'cursor-pointer' ],
  }, slots.default)
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <slot
    :Component="button"
    :props="props"
  />
</template>
