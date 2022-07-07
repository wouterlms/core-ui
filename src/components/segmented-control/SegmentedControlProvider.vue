<script setup lang="ts">
import {
  StyleValue,
  computed,
  defineProps,
  onBeforeUnmount,
  onMounted,
  provide,
  readonly,
  ref,
  toRef,
  watch,
  withDefaults,
} from 'vue'

import { useVModel } from '@wouterlms/composables'

import { key } from './useSegmentedControl'

interface SegmentDimensions {
  left: number
  width: number
}

export interface Props {
  /**
   * @model
   */
  modelValue: unknown
}

const props = withDefaults(defineProps<Props>(), {})

const value = useVModel(toRef(props, 'modelValue'))

const segments = ref<unknown[]>([])
const segmentControlEl = ref<HTMLElement | null>(null)
const segmentDimensions = ref<SegmentDimensions[]>([])
const transitionDuration = ref(0)

let mutationObserver: MutationObserver | null = null

// as soon as the first value is set, enable the transition
watch(value, () => {
  transitionDuration.value = 400
})

const isSegmentSelected = (segment: unknown) => (
  JSON.stringify(value.value) === JSON.stringify(segment)
)

const style = computed<StyleValue>(() => {
  if (!segmentDimensions.value.length) {
    return {}
  }

  const segmentIndex = segments.value.findIndex((segment) => isSegmentSelected(segment))

  const { left, width } = segmentDimensions.value[segmentIndex]

  return {
    position: 'absolute',
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
    transform: `translate3d(${left}px, 0, 0)`,
    width: `${width}px`,
    transition: `${transitionDuration.value}ms cubic-bezier(0.8, 0.5, 0.3, 1)`,
  } as StyleValue
})

const selectSegment = (segment: unknown) => {
  value.value = segment
}

const setSegmentDimensions = () => {
  if (!segmentControlEl.value) {
    return
  }

  Array.from(segmentControlEl.value.querySelectorAll('button')).forEach((tab, i) => {
    segmentDimensions.value[i] = {
      width: tab.clientWidth,
      left: tab.offsetLeft,
    }
  })
}

const createMutationObserver = () => {
  mutationObserver = new MutationObserver(() => {
    setSegmentDimensions()
  })

  mutationObserver.observe(segmentControlEl.value as HTMLElement, {
    childList: true,
    subtree: true,
    attributes: true,
  })
}

const registerSegment = (segment: unknown) => {
  segments.value.push(segment)
}

const unregisterSegment = (segment: unknown) => {
  const segmentIndex = segments.value.findIndex((s) => (
    JSON.stringify(s) === JSON.stringify(segment)
  ))

  segments.value.splice(segmentIndex, 1)
}

provide(key, {
  selectedSegment: readonly(value),
  registerSegment,
  unregisterSegment,
  selectSegment,
})

onMounted(() => {
  setSegmentDimensions()
  createMutationObserver()
})

onBeforeUnmount(() => {
  mutationObserver?.disconnect()
})
</script>

<template>
  <div
    ref="segmentControlEl"
    class="relative"
  >
    <slot :style="style" />
  </div>
</template>
