<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  h,
  useAttrs,
  useSlots,
} from 'vue'

import {
  RouteLocation,
  RouterLink,
} from 'vue-router'

interface Props {
  /**
   * Renders a `<RouterLink>`
   */
  to?: RouteLocation

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

const emit = defineEmits<{(event: 'click'): void }>()

const attrs = useAttrs()
const slots = useSlots()
const router = getCurrentInstance()?.proxy?.$router

const component = computed<typeof RouterLink | string>(() => {
  if (props.to || props.href) {
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
    href: href || to ? router?.resolve(props.to).fullPath : undefined,
    type: !to && !href ? type : undefined,
    disabled: isLoading || isDisabled,
    class: [ 'inline-block', props.isDisabled || props.isLoading ? 'cursor-not-allowed' : 'cursor-pointer' ],
    onClick: (e: MouseEvent) => {
      if (props.to) {
        e.preventDefault()
        router?.push(props.to)
      }

      emit('click')
    },
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
