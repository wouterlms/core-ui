<script setup lang="ts">
import {
  computed,
  defineEmits,
  defineProps,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  withDefaults,
} from 'vue'

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

import { clickOutside as vClickOutside } from '@/directives'

import { colors } from '@/utils'

export interface Props {
  show: boolean
  position?: Placement
  offset?: number
  margin?: number
  containerPadding?: number
  zIndex?: number
  inheritWidth?: boolean
  showArrow?: boolean
  teleport?: boolean
  backgroundColor?: string

  container?: HTMLElement
}

enum TooltipState {
  INITIAL,
  ENTERING,
  VISIBLE,
  LEAVING,
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
  offset: 0,
  margin: 0,
  containerPadding: 0,
  zIndex: 2,
  inheritWidth: false,
  showArrow: true,
  teleport: false,
  backgroundColor: colors.value.background.primary,

  container: undefined,
})

const emit = defineEmits<{(event: 'clickOutside', e: MouseEvent): void }>()

const emptyEl = ref()
const tooltipEl = ref()
const parentEl = ref()
const arrowEl = ref()

const state = ref(TooltipState.INITIAL)

const computedZIndex = computed(() => {
  if (state.value === TooltipState.ENTERING) {
    return props.zIndex + 1
  }

  if (state.value === TooltipState.LEAVING) {
    return props.zIndex + 2
  }

  return props.zIndex
})

let cleanup: (() => void) | null = null

const position = reactive({
  x: 0,
  y: 0,
})

const arrowPosition = reactive<{ x: number | null, y: number | null }>({
  x: 0,
  y: 0,
})

const actualPosition = ref<'top' | 'bottom' | 'left' | 'right'>('bottom')

const width = ref<number>()

const isHorizontalPlacement = computed(() => (
  [ 'top', 'bottom' ].includes(props.position)
))

const updatePosition = async () => {
  const middleware: Middleware[] = [
    offset({
      mainAxis: isHorizontalPlacement.value ? props.margin : props.offset,
      crossAxis: isHorizontalPlacement.value ? props.offset : props.margin,
    })
  ]

  if (props.container !== undefined) {
    middleware.push(shift({
      boundary: props.container,
      crossAxis: true,
      padding: props.containerPadding,
    }))
  }

  middleware.push(
    flip(),
    arrow({
      element: arrowEl.value,
    }),
    size({
      apply({ reference }) {
        width.value = reference.width
      },
    })
  )

  const {
    x,
    y,
    middlewareData: { arrow: _arrowPosition },
    placement,
  } = await computePosition(parentEl.value, tooltipEl.value, {
    middleware,
    placement: props.position,
  })

  actualPosition.value = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]] as typeof actualPosition.value

  position.x = x
  position.y = y

  arrowPosition.x = _arrowPosition?.x ?? null
  arrowPosition.y = _arrowPosition?.y ?? null
}

onMounted(() => {
  parentEl.value = emptyEl.value.parentElement

  cleanup = autoUpdate(parentEl.value, tooltipEl.value, updatePosition)
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div ref="emptyEl" />

  <Teleport
    to="body"
    :disabled="!teleport"
  >
    <Transition
      name="tooltip-transition"
      @before-enter="state = TooltipState.ENTERING"
      @after-enter="state = TooltipState.VISIBLE"
      @before-leave="state = TooltipState.LEAVING"
    >
      <div
        v-show="show"
        v-bind="$attrs"
        ref="tooltipEl"
        v-click-outside="(e: MouseEvent) => emit('clickOutside', e)"
        :style="{
          backgroundColor,
          zIndex: computedZIndex,
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: inheritWidth ? `${width}px` : undefined,
        }"
        class="absolute rounded shadow-primary"
      >
        <div
          v-show="showArrow"
          ref="arrowEl"
          :style="{
            backgroundColor,
            left: arrowPosition.x !== null ? `${arrowPosition.x}px` : '',
            top: arrowPosition.y !== null ? `${arrowPosition.y}px` : '',
            right: '',
            bottom: '',
            [actualPosition]: '-4px',
          }"
          class="absolute h-3 rotate-45 rounded-sm shadow-primary w-3"
        />

        <div
          :style="{
            backgroundColor,
          }"
          class="h-full left-0 overflow-hidden relative rounded top-0 w-full z-[1]"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.tooltip-transition {
  &-enter-active,
  &-leave-active {
    transition:
      0.15s transform,
      0.15s opacity;
  }

  &-enter-from,
  &-leave-to {
    transform: scale(0.98);
    opacity: 0;
  }
}
</style>
