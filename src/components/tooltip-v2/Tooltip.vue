<script setup lang="ts">
import {
  Middleware,
  Placement,
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  size,
} from '@floating-ui/dom'

import { computed } from '@vue/reactivity'

import {
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from 'vue'

interface Props {
  position?: Placement
  offset?: number
  margin?: number
  inheritWidth?: boolean

  container?: HTMLElement
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
  offset: 0,
  margin: 0,
  inheritWidth: false,

  container: undefined,
})

const emptyEl = ref()
const tooltipEl = ref()
const parentEl = ref()
const arrowEl = ref()

let cleanup: (() => void) | null = null

const position = reactive({
  x: 0,
  y: 0,
})

const arrowPosition = reactive({
  x: 0,
  y: 0,
})

const width = ref<number>()

const isHorizontalPlacement = computed(() => (
  props.position.includes('top') || props.position.includes('bottom')
))

const updatePosition = async () => {
  const middleware: Middleware[] = [
    offset({
      mainAxis: isHorizontalPlacement.value ? props.margin : props.offset,
      crossAxis: !isHorizontalPlacement.value ? props.margin : props.offset,
    }),
    shift({
      boundary: props.container,
      padding: 0, // Maybe later if necessary
    }),
    flip(),
    arrow({
      element: arrowEl.value,
    }),
    size({
      apply({ reference }) {
        width.value = reference.width
      },
    })
  ]

  const {
    x,
    y,
    middlewareData: { arrow: _arrowPosition },
  } = await computePosition(parentEl.value, tooltipEl.value, {
    middleware,
    placement: props.position,
  })

  position.x = x
  position.y = y

  arrowPosition.x = _arrowPosition?.x ?? 0
  arrowPosition.y = _arrowPosition?.y ?? 0
}

onMounted(() => {
  parentEl.value = emptyEl.value.parentElement

  cleanup = autoUpdate(parentEl.value, tooltipEl.value, updatePosition)
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<template>
  <div ref="emptyEl" />

  <Teleport to="body">
    <div
      ref="tooltipEl"
      :style="{
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: inheritWidth ? `${width}px` : undefined,
      }"
      class="absolute"
    >
      <div
        ref="arrowEl"
        :style="{
          top: `${arrowPosition.y}px`,
          left: `${arrowPosition.x}px`
        }"
        class="absolute bg-red-500 h-4 rotate-45 w-4"
      />
      <slot />
    </div>
  </Teleport>
</template>
