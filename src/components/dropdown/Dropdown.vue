<script setup lang="ts">
import {
  nextTick,
  ref,
  toRef,
  watch,
} from 'vue'

import {
  useEventListener,
  useVModel,
} from '@wouterlms/composables'

import { clickOutside as vClickOutside } from '@/directives'

import Tooltip from '../tooltip/Tooltip.vue'

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

const props = withDefaults(defineProps<Props>(), {
  autoPlacement: true,
})

const showDropdown = useVModel(toRef(props, 'show'), 'show')

const tooltipEl = ref<InstanceType<typeof Tooltip>>()
const previouslyFocusedElement = ref<HTMLElement | null>(null)

const autoPlacementPosition = ref<'top' | 'bottom'>('bottom')

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
    autoPlacementPosition.value = 'bottom'

    setTimeout(() => {
      hasFocusTimeout.value = false
    }, 0)
  }
})

watch(([ scrollPosition, showDropdown ]), () => {
  if (!props.autoPlacement || !showDropdown.value || hasFocusTimeout.value) {
    return
  }

  const tooltipContent = tooltipEl.value?.$el as HTMLElement

  const { height } = tooltipContent.getBoundingClientRect()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { height: parentHeight, top } = tooltipContent.parentElement!.getBoundingClientRect()

  const isOverflowingAtTop = top - height < 0
  const isOverflowingAtBottom = top + parentHeight + height > window.innerHeight

  if (isOverflowingAtBottom && !isOverflowingAtTop) {
    autoPlacementPosition.value = 'top'
  } else {
    autoPlacementPosition.value = 'bottom'
  }
}, { flush: 'post' })
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
      v-click-outside="() => showDropdown = false"
      :show="showDropdown && !hasFocusTimeout"
      :is-interactable="true"
      :position="autoPlacement ? autoPlacementPosition : undefined"
    >
      <slot name="dropdown" />
    </Tooltip>
  </div>
</template>
