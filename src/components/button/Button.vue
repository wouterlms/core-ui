<script setup lang="ts">
import {
  computed,
  defineProps,
  useAttrs,
  useSlots,
  withDefaults,
} from 'vue'

import { Svg, colors } from '@/theme'
import { ButtonVariant, Rounded } from '@/enums'

import {
  useBorderRadius,
  useColor,
  useIsKeyboardMode,
} from '@/composables'

import useButton, { Props as BaseProps } from './useButton'

import Icon from '../icon/Icon.vue'
import Loader from '../loader/Loader.vue'

export interface Props extends BaseProps {
  /**
   * Button color
   */
  accentColor?: string

  /**
   * Button styling
   */
  variant?: ButtonVariant

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
   */
  rounded?: Rounded
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: undefined,
  variant: ButtonVariant.SOLID,
  iconLeft: undefined,
  iconRight: undefined,
  iconSize: '0.875em',
  iconSpacing: '0.8em',

  padding: undefined,
  rounded: Rounded.DEFAULT,
})

const attrs = useAttrs()
const slots = useSlots()

const {
  Component,
  state,
} = useButton()

const { isDarkColor } = useColor()
const isKeyboardMode = useIsKeyboardMode()

const computedAccentColor = computed(
  () => props.accentColor ?? colors.value.accent.primary,
)

const textColor = computed(() => (
  isDarkColor(computedAccentColor.value)
    ? '#fff'
    : '#000'))

const backgroundColor = computed(() => {
  if ([
    ButtonVariant.OUTLINE,
    ButtonVariant.GHOST,
    ButtonVariant.UNSTYLED,
  ].includes(props.variant)) {
    return 'transparent'
  }

  return computedAccentColor.value
})

const color = computed(() => {
  if ([
    ButtonVariant.GHOST,
    ButtonVariant.OUTLINE,
  ].includes(props.variant)) {
    return computedAccentColor.value
  }

  if (props.variant === ButtonVariant.UNSTYLED) {
    return colors.value.text.secondary
  }

  return textColor.value
})

const borderColor = computed(() => {
  if ([
    ButtonVariant.SOLID,
    ButtonVariant.OUTLINE,
  ].includes(props.variant)) {
    return computedAccentColor.value
  }

  return 'transparent'
})

const computedPadding = computed(() => {
  if (props.padding) {
    return props.padding
  }

  if (props.variant === ButtonVariant.UNSTYLED) {
    return '0em'
  }

  if (slots.default) {
    return '1em'
  }

  return '1em 1.2em'
})

const hasExplicitWidth = computed(() => /w-/.test(attrs.class as string))
</script>

<template>
  <Component
    :is="Component"
    :class="[
      {
        'active:brightness-[1.2]': !state.isDisabled && !state.isLoading,
        'opacity-50': state.isDisabled,
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
      v-if="state.isLoading && !hasExplicitWidth"
      class="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2"
    >
      <Loader
        :accent-color="color"
        class="text-[0.7em]"
      />
    </div>

    <div
      :class="{
        'opacity-0': state.isLoading && !hasExplicitWidth
      }"
      class="flex items-center justify-center relative"
    >
      <div class="relative">
        <Transition :name="!!iconLeft ? 'loader-with-icon-left' : 'loader'">
          <div
            v-if="state.isLoading && hasExplicitWidth"
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
