<script setup lang="ts">
import {
  ref,
  toRef,
  watch,
} from 'vue'

import { useVModel } from '@wouterlms/composables'

interface Props {
  /**
   * Current scrollposition, setting a value will trigger `scrollTo`
   * @model
   */
  scrollPosition?: number
}

const props = withDefaults(defineProps<Props>(), {
  scrollPosition: undefined,
})

/* eslint-disable-next-line */
const emit = defineEmits<{
  /**
   * On top reached
   */
  (event: 'top'): void
  /**
   * On bottom reached
   */
  (event: 'bottom'): void
  /**
   * On scroll
   */
  (event: 'update:scrollPosition', scrollPos: number): void
}>()

const scrollPositionValue = props.scrollPosition === undefined
  ? ref(0)
  : useVModel(toRef(props, 'scrollPosition'), 'scrollPosition')

const scrollableEl = ref<HTMLElement | null>(null)

const handleScroll = () => {
  const scrollPos = scrollableEl.value?.scrollTop || 0
  scrollPositionValue.value = scrollPos
}

const hasReachedEnd = () => {
  const {
    scrollTop,
    scrollHeight,
    clientHeight,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = scrollableEl.value!

  return scrollTop === scrollHeight - clientHeight
}

watch(scrollPositionValue, (scrollPos) => {
  if (scrollPos !== scrollableEl.value?.scrollTop) {
    scrollableEl.value?.scrollTo(0, scrollPos)
  }

  if (scrollPos === 0) {
    /**
     * @event top
     */
    emit('top')
  } else if (hasReachedEnd()) {
    /**
     * @event bottom
     */
    emit('bottom')
  }
})
</script>

<template>
  <div
    ref="scrollableEl"
    class="overflow-y-auto"
    @scroll="handleScroll"
  >
    <slot :scroll-position="scrollPositionValue" />
  </div>
</template>
