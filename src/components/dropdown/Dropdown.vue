<script setup lang="ts">
import {
  defineProps,
  ref,
  toRef,
  watch,
  withDefaults,
} from 'vue'

import {
  useEventListener,
  useVModel,
} from '@wouterlms/composables'

import { Popover } from '@/components'

export interface Props {
  /**
   * @model
   */
  show: boolean

  /**
   * Auto position dropdown when overflowing
   */
  autoPlacement?: boolean
}

// TODO: implement styling, nonStlying attrs

const props = withDefaults(defineProps<Props>(), {})

const showDropdown = useVModel(toRef(props, 'show'), 'show')

const popoverEl = ref<InstanceType<typeof Popover>>()
const wrapperEl = ref<HTMLElement | null>(null)
const previouslyFocusedElement = ref<HTMLElement | null>(null)

const scrollPosition = ref(0)
const wasClosedByMouse = ref(false)

useEventListener('scroll', () => {
  scrollPosition.value = window.scrollY
})

// when the dropdown is closed, the previouslyFocusedElement
// value.value will be focused. But it might be the element
// with @focus which re-opens the dropdown
// so a timeout of 1 tick fixes it opening again immediately
const hasFocusTimeout = ref(false)

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.preventDefault()
  }

  if (e.key === 'Escape' || e.key === 'Tab') {
    showDropdown.value = false
  }
})

// Element might be focused again, so when the focus timeout
// is finished, make sure the dropdown is hidden
watch(hasFocusTimeout, (hasFocusTimeoutValue) => {
  if (!hasFocusTimeoutValue && showDropdown.value) {
    showDropdown.value = false
  }
})

watch(showDropdown, (show) => {
  if (show) {
    setTimeout(() => {
      previouslyFocusedElement.value = (document.activeElement ?? null) as HTMLElement | null
    }, 0)
  } else if (previouslyFocusedElement.value) {
    if (!wasClosedByMouse.value) {
      previouslyFocusedElement.value.focus()
    }

    hasFocusTimeout.value = true
    wasClosedByMouse.value = false

    setTimeout(() => {
      hasFocusTimeout.value = false
    }, 0)
  }
})

const isChildElement = (element: HTMLElement) => {
  let node = element.parentNode

  while (node !== null) {
    if (node === wrapperEl.value) {
      return true
    }

    node = node.parentNode
  }

  return false
}

const handleClickOutside = ({ target }: MouseEvent) => {
  if (!isChildElement(target as HTMLElement)) {
    wasClosedByMouse.value = true
    showDropdown.value = false
  }
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div
    ref="wrapperEl"
    :style="{
      width: 'inherit'
    }"
    class="inline-block relative"
  >
    <slot />

    <Popover
      v-bind="$attrs"
      ref="popoverEl"
      :show="showDropdown && !hasFocusTimeout"
      @click-outside="handleClickOutside"
    >
      <slot name="dropdown" />
    </Popover>
  </div>
</template>
