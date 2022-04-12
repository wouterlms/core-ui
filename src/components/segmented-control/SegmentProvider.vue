<script setup lang="ts">
import {
  computed,
  defineProps,
  h,
  onBeforeUnmount,
  withDefaults,
} from 'vue'

import { useIsKeyboardMode } from '@/composables'

import { useSegmentedControl } from './useSegmentedControl'

interface Props {
  /**
   * Segment value
   */
  segment: unknown
}

const props = withDefaults(defineProps<Props>(), {})

const {
  selectedSegment,
  selectSegment,
  registerSegment,
  unregisterSegment,
} = useSegmentedControl()

const isKeyboardMode = useIsKeyboardMode()

registerSegment(props.segment)

onBeforeUnmount(() => {
  unregisterSegment(props.segment)
})

const isSelected = computed(
  () => selectedSegment.value !== null
  && JSON.stringify(selectedSegment.value) === JSON.stringify(props.segment)
)

const component = computed(() => h('button', {
  type: 'button',
  class: {
    'focus:ring': isKeyboardMode.value,
  },
  onClick: () => selectSegment(props.segment),
}))
</script>

<template>
  <slot
    :Component="component"
    :is-selected="isSelected"
  />
</template>
