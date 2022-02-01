<script setup lang="ts">
import { computed } from 'vue'

enum Position {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

enum Align {
  TOP = 'top',
  LEFT = 'left',
  CENTER = 'center',
  BOTTOM = 'bottom',
  RIGHT = 'right',
}

interface Props {
  show: boolean
  position?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'top' | 'left' | 'center' | 'bottom' | 'right'
  alignArrow?: 'top' | 'left' | 'center' | 'bottom' | 'right'
  margin?: string
  offset?: string
  arrowOffset?: string
  transition?: string
  showArrow?: boolean
  inheritWidth?: boolean
  isInteractable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
  align: 'center',
  alignArrow: 'center',
  margin: '0px',
  offset: '0px',
  arrowOffset: '0px',
  transition: undefined,
  showArrow: true,
  isInteractable: false,
})

const transformCssProperties = (properties: Record<string, string | number | undefined>) => {
  const transformedProperties: Record<string, string | number | undefined> = {}

  Object.entries(properties).forEach(([ key, value ]) => {
    if (typeof value === 'number') {
      transformedProperties[key] = `${value}px`
    } else {
      transformedProperties[key] = value
    }
  })

  return transformedProperties
}

// TODO: format code

const style = computed(() => {
  let position: Record<string, number | string | undefined> = {
    top: undefined,
    left: undefined,
    bottom: undefined,
    right: undefined,
  }

  let transform: Record<string, string | number | undefined> = {
    x: 0,
    y: 0,
  }

  const isVertical = props.position === Position.TOP || props.position === Position.BOTTOM

  if (isVertical) {
    if (props.align === Align.LEFT) {
      position.left = `-${props.offset}`
    } else if (props.align === Align.RIGHT) {
      position.right = `-${props.offset}`
    } else {
      position.left = `calc(50% + ${props.offset})`
      transform.x = '-50%'
    }
  // Horizontal
  } else if (props.align === Align.TOP) {
    position.top = `-${props.offset}`
  } else if (props.align === Align.BOTTOM) {
    position.bottom = `-${props.offset}`
  } else {
    position.top = `calc(50% + ${props.offset})`
    transform.y = '-50%'
  }

  // eslint-disable-next-line default-case
  switch (props.position) {
    case Position.TOP:
      position.top = `-${props.margin}`
      transform.y = '-100%'
      break

    case Position.BOTTOM:
      position.bottom = `-${props.margin}`
      transform.y = '100%'
      break

    case Position.LEFT:
      position.left = `-${props.margin}`
      transform.x = '-100%'
      break

    case Position.RIGHT:
      position.right = `-${props.margin}`
      transform.x = '100%'
      break
  }

  position = transformCssProperties(position)
  transform = transformCssProperties(transform)

  return {
    ...position,
    transform: `translate3d(${transform.x}, ${transform.y}, 0)`,
  }
})

const arrowStyle = computed(() => {
  let position: Record<string, number | string | undefined> = {
    top: undefined,
    left: undefined,
    bottom: undefined,
    right: undefined,
  }

  let transform: Record<string, string | number | undefined> = {
    x: 0,
    y: 0,
  }

  const isVertical = props.position === Position.TOP || props.position === Position.BOTTOM

  if (isVertical) {
    if (props.alignArrow === Align.LEFT) {
      position.left = props.arrowOffset
    } else if (props.alignArrow === Align.RIGHT) {
      position.right = props.arrowOffset
    } else {
      position.left = `calc(50% + ${props.arrowOffset})`
      transform.x = '-50%'
    }
  // Horizontal
  } else if (props.alignArrow === Align.TOP) {
    position.top = `-${props.arrowOffset}`
  } else if (props.alignArrow === Align.BOTTOM) {
    position.bottom = `-${props.arrowOffset}`
  } else {
    position.top = `calc(50% + ${props.arrowOffset})`
    transform.y = '-50%'
  }

  // eslint-disable-next-line default-case
  switch (props.position) {
    case Position.TOP:
      position.bottom = '1px'
      transform.y = '50%'
      break

    case Position.BOTTOM:
      position.top = '1px'
      transform.y = '-50%'
      break

    case Position.LEFT:
      position.right = '1px'
      transform.x = '50%'
      break

    case Position.RIGHT:
      position.left = '1px'
      transform.x = '-50%'
      break
  }

  position = transformCssProperties(position)
  transform = transformCssProperties(transform)

  return {
    ...position,
    transform: `translate3d(${transform.x}, ${transform.y}, 0) rotate(45deg)`,
  }
})

const computedTransition = computed(() => {
  if (props.transition) {
    return props.transition
  }

  let tooltipTransition = 'bottom'

  if (props.position === Position.TOP) {
    tooltipTransition = 'top'
  } else if (props.position === Position.LEFT) {
    tooltipTransition = 'left'
  } else if (props.position === Position.RIGHT) {
    tooltipTransition = 'right'
  }
  return `tooltip-transition-${tooltipTransition}`
})
</script>

<template>
  <Transition :name="computedTransition">
    <div
      v-if="show"
      :style="style"
      :class="{
        'w-full': inheritWidth,
        'pointer-events-none': !isInteractable
      }"
      class="absolute z-[1]"
    >
      <div
        :class="{
          transition: '0.3s cubic-bezier(0.22, 0.68, 0, 1.51)',
        }"
        class="bg-primary content overflow-hidden rounded shadow-light w-full"
      >
        <div
          v-if="showArrow"
          :style="arrowStyle"
          class="absolute bg-primary h-[10px] rounded-[0.15em] transform w-[10px]"
        />

        <div class="bg-primary overflow-hidden relative rounded-sm z-[1]">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.tooltip-transition-top,
.tooltip-transition-bottom,
.tooltip-transition-left,
.tooltip-transition-right {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s cubic-bezier(0.22, 0.68, 0, 1.51);
  }

  &-enter-from,
  &-leave-to {
    .content {
      opacity: 0;
    }
  }
}

.tooltip-transition-top {
  &-enter-from,
  &-leave-to {
    .content {
      transform: translateY(10px);
    }
  }
}

.tooltip-transition-bottom {
  &-enter-from,
  &-leave-to {
    .content {
      transform: translateY(-10px);
    }
  }
}

.tooltip-transition-left {
  &-enter-from,
  &-leave-to {
    .content {
      transform: translateX(10px);
    }
  }
}

.tooltip-transition-right {
  &-enter-from,
  &-leave-to {
    .content {
      transform: translateX(-10px);
    }
  }
}

.sleek {
  &-enter-active,
  &-leave-active {
    transition: 0.2s opacity cubic-bezier(0.22, 0.68, 0, 1.3);

    .content {
      transition: 0.2s cubic-bezier(0.22, 0.68, 0, 1.3);
    }
  }

  &-enter-from,
  &-leave-to {
    .content {
      transform: scale(0.9);
      opacity: 0;
    }
  }
}
</style>
