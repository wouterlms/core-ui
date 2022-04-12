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

import Tooltip from '../tooltip-v2/Tooltip.vue'

interface Props {
  /**
   * @model
   */
  show: boolean

  /**
   * Auto position dropdown when overflowing
   */
  autoPlacement?: boolean
}

const props = withDefaults(defineProps<Props>(), {})

const showDropdown = useVModel(toRef(props, 'show'), 'show')

const tooltipEl = ref<InstanceType<typeof Tooltip>>()
const previouslyFocusedElement = ref<HTMLElement | null>(null)

const scrollPosition = ref(0)
const isClosedWithTabKey = ref(false)

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

  if (e.key === 'Tab' && !e.shiftKey) {
    isClosedWithTabKey.value = true
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
    isClosedWithTabKey.value = false

    setTimeout(() => {
      previouslyFocusedElement.value = (document.activeElement ?? null) as HTMLElement | null
    }, 0)
  } else if (previouslyFocusedElement.value && !isClosedWithTabKey.value) {
    previouslyFocusedElement.value.focus()

    hasFocusTimeout.value = true

    setTimeout(() => {
      hasFocusTimeout.value = false
    }, 0)
  }
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div
    :style="{
      width: 'inherit'
    }"
    class="inline-block relative"
  >
    <slot />

    <Tooltip
      v-bind="$attrs"
      ref="tooltipEl"
      :show="showDropdown && !hasFocusTimeout"
      @click-outside="() => showDropdown = false"
    >
      <slot name="dropdown" />
    </Tooltip>
  </div>
</template>
