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

interface Props {
  show: boolean
  position?: Placement
  offset?: number
  margin?: number
  inheritWidth?: boolean
  showArrow?: boolean
  teleport?: boolean

  container?: HTMLElement
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
  offset: 0,
  margin: 0,
  inheritWidth: false,
  showArrow: true,
  teleport: false,

  container: undefined,
})

const emit = defineEmits<{(event: 'clickOutside'): void }>()

const emptyEl = ref()
const tooltipEl = ref()
const parentEl = ref()
const arrowEl = ref()

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
      padding: 0, // Maybe later if necessary
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
    <Transition name="tooltip-transition">
      <div
        v-show="show"
        v-bind="$attrs"
        ref="tooltipEl"
        v-click-outside="() => emit('clickOutside')"
        :style="{
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: inheritWidth ? `${width}px` : undefined,
        }"
        class="absolute bg-primary rounded shadow-light"
      >
        <div
          v-show="showArrow"
          ref="arrowEl"
          :style="{
            left: arrowPosition.x !== null ? `${arrowPosition.x}px` : '',
            top: arrowPosition.y !== null ? `${arrowPosition.y}px` : '',
            right: '',
            bottom: '',
            [actualPosition]: '-4px',
          }"
          class="absolute bg-primary h-3 rotate-45 rounded-sm shadow-light w-3"
        />

        <div class="bg-primary h-full left-0 relative rounded top-0 w-full z-[1]">
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
      0.1s transform,
      0.1s opacity;
  }

  &-enter-from,
  &-leave-to {
    transform: scale(0.98);
    opacity: 0;
  }
}
</style>
