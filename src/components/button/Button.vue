<script setup lang="ts">
import {
  computed,
  useSlots,
} from 'vue'

import {
  useBorderRadius,
  useColor,
  useIsKeyboardMode,
  useStylingAttributes,
  useTheme,
} from '@/composables'

import { BorderRadius } from '@/types'

import { Svg } from '@/utils'

import ButtonProvider from './ButtonProvider.vue'
import Icon from '../icon/Icon.vue'
import Loader from '../loader/Loader.vue'

interface Props {
  /** Button styling */
  variant?: 'solid' | 'outline' | 'ghost'

  /**
   * Color scheme - can be predefined scheme or a custom color
   * @values 'success' | 'error' | 'danger' | string
   */
  colorScheme?: 'success' | 'error' | 'danger' | string

  /**
   * Show icon on the left side
   */
  iconLeft?: Svg

  /**
   * Show icon on the right side
   */
  iconRight?: Svg

  /**
   * The size of the icons
   */
  iconSize?: string

  /**
   * The space between the button icon and label
   */
  iconSpacing?: string

  /**
   * Button padding values
   * Defaults to `1em 1.2em`. Or `1em` when no slot content is passed
   */
  padding?: string

  /**
   * Border radius
   * @values 'none' | 'sm' | 'default' | 'md' | 'lg' | 'full'
   */
  rounded?: BorderRadius
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  colorScheme: 'accent-primary',
  iconLeft: undefined,
  iconRight: undefined,
  iconSize: '0.875em',
  iconSpacing: '0.8em',

  padding: undefined,
  rounded: 'default',
})

const { stylingAttrs, nonStylingAttrs } = useStylingAttributes()
const { isDarkColor } = useColor()
const { getThemeColor } = useTheme()

const slots = useSlots()
const isKeyboardMode = useIsKeyboardMode()

const colorSchemeColor = computed(() => getThemeColor(props.colorScheme))

if (!colorSchemeColor.value) {
  throw new Error('Invalid `color-scheme` color')
}

const textColor = computed(() => (isDarkColor(colorSchemeColor.value) ? '#fff' : '#000'))

const backgroundColor = computed(() => {
  if (props.variant === 'outline' || props.variant === 'ghost') {
    return 'transparent'
  }

  return colorSchemeColor.value
})

const color = computed(() => {
  if (props.variant === 'outline' || props.variant === 'ghost') {
    return colorSchemeColor.value
  }

  return textColor.value
})

const borderColor = computed(() => {
  if (props.variant === 'solid' || props.variant === 'outline') {
    return colorSchemeColor.value
  }

  return 'transparent'
})

const computedPadding = computed(() => {
  if (props.padding) {
    return props.padding
  }

  if (slots.default) {
    return '1em'
  }

  return '1em 1.2em'
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <ButtonProvider
    v-slot="{ Component, props: providedProps }"
    v-bind="nonStylingAttrs"
  >
    <Component
      :is="Component"
      v-bind="stylingAttrs"
      :class="[
        {
          'active:opacity-80': !providedProps.isDisabled && !providedProps.isLoading,
          'opacity-50': providedProps.isDisabled,
          'focus:ring': isKeyboardMode
        },
      ]"
      :style="{
        backgroundColor,
        borderColor,
        color,
        padding: computedPadding,
        borderRadius: useBorderRadius()
      }"
      class="border border-solid duration-200 relative text-sm"
    >
      <div
        v-if="providedProps.isLoading"
        class="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2"
      >
        <Loader
          :accent-color="color"
          class="text-xs"
        />
      </div>

      <div
        :class="{
          'opacity-0': providedProps.isLoading
        }"
        class="flex items-center"
      >
        <Icon
          v-if="iconLeft"
          :icon="iconLeft"
          :style="{
            width: iconSize,
            height: iconSize,
            marginRight: !!$slots.default ? iconSpacing : undefined
          }"
        />

        <span class="pointer-events-none text-[0.875em]">
          <slot />
        </span>

        <Icon
          v-if="iconRight"
          :icon="iconRight"
          :style="{
            width: iconSize,
            height: iconSize,
            marginLeft: !!$slots.default ? iconSpacing : undefined
          }"
        />
      </div>
    </Component>
  </ButtonProvider>
</template>
