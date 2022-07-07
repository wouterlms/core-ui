<script setup lang="ts">
import {
  computed,
  defineProps,
  useSlots,
  withDefaults,
} from 'vue'

import {
  useBorderRadius,
  useColor,
  useIsKeyboardMode,
  useStylingAttributes,
} from '@/composables'

import { Svg } from '@/utils'
import { colors } from '@/utils-v2'

import { BorderRadius } from '@/types'

import ButtonProvider from './ButtonProvider.vue'
import Icon from '../icon/Icon.vue'
import Loader from '../loader/Loader.vue'

export interface Props {
  /**
   * Button color
   */
  accentColor?: string

  /** Button styling */
  variant?: 'solid' | 'outline' | 'ghost' | 'unstyled'

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
  accentColor: colors.value.accent.primary,
  variant: 'solid',
  iconLeft: undefined,
  iconRight: undefined,
  iconSize: '0.875em',
  iconSpacing: '0.8em',

  padding: undefined,
  rounded: 'default',
})

const { stylingAttrs, nonStylingAttrs } = useStylingAttributes()
const { isDarkColor } = useColor()

const slots = useSlots()
const isKeyboardMode = useIsKeyboardMode()

const textColor = computed(() => (isDarkColor(props.accentColor) ? '#fff' : '#000'))

const backgroundColor = computed(() => {
  if ([
    'outline',
    'ghost',
    'unstyled'
  ].includes(props.variant)) {
    return 'transparent'
  }

  return props.accentColor
})

const color = computed(() => {
  if ([ 'ghost', 'outline' ].includes(props.variant)) {
    return props.accentColor
  }

  if (props.variant === 'unstyled') {
    return colors.value.text.secondary
  }

  return textColor.value
})

const borderColor = computed(() => {
  if ([ 'solid', 'outline' ].includes(props.variant)) {
    return props.accentColor
  }

  return 'transparent'
})

const computedPadding = computed(() => {
  if (props.padding) {
    return props.padding
  }

  if (props.variant === 'unstyled') {
    return '0em'
  }

  if (slots.default) {
    return '1em'
  }

  return '1em 1.2em'
})

const hasExplicitWidth = computed(() => /w-/.test(stylingAttrs.value.class))
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
          'active:brightness-[1.2]': !providedProps.isDisabled && !providedProps.isLoading,
          'opacity-50': providedProps.isDisabled,
          'focus:ring': isKeyboardMode,
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
        v-if="providedProps.isLoading && !hasExplicitWidth"
        class="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2"
      >
        <Loader
          :accent-color="color"
          class="text-[0.7em]"
        />
      </div>

      <div
        :class="{
          'opacity-0': providedProps.isLoading && !hasExplicitWidth
        }"
        class="flex items-center justify-center relative"
      >
        <div class="relative">
          <Transition :name="!!iconLeft ? 'loader-with-icon-left' : 'loader'">
            <div
              v-if="providedProps.isLoading && hasExplicitWidth"
              :style="{
                width: iconSize,
                height: iconSize,
                marginRight: !!$slots.default ? iconSpacing : undefined
              }"
              class="relative"
            >
              <Loader
                :accent-color="color"
                class="!absolute -translate-x-1/2 -translate-y-1/2 left-1/2 text-[0.7em] top-1/2"
              />
            </div>

            <div v-else-if="iconLeft">
              <Icon
                :icon="iconLeft"
                :style="{
                  width: iconSize,
                  height: iconSize,
                  marginRight: !!$slots.default ? iconSpacing : undefined
                }"
              />
            </div>
          </Transition>
        </div>

        <span class="pointer-events-none text-[0.875em] whitespace-nowrap">
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

<style lang="scss">
.loader {
  &-enter-active,
  &-leave-active {
    transition: 0.3s cubic-bezier(0.17, 0.67, 0.16, 0.99);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    width: 0 !important;
    margin-right: 0 !important;
  }
}

.loader-with-icon-left {
  &-enter-active,
  &-leave-active {
    transition: 0.3s cubic-bezier(0.17, 0.67, 0.16, 0.99);
  }

  &-leave-active {
    position: absolute;
    left: 0;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

}
</style>
