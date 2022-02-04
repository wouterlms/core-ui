<script setup lang="ts">
import { useSlots } from 'vue'

import {
  useBorderRadius,
  useColor,
  useIsKeyboardMode,
  useStylingAttributes,
  useTheme,
} from '@/composables'

import { BorderRadius } from '@/types'

import { Svg } from '@/utils'

import CheckboxProvider from './CheckboxProvider.vue'
import Icon from '../icon/Icon.vue'

interface Props {
  modelValue: unknown
  value: unknown
  error?: boolean
  accentColor?: string

  rounded?: BorderRadius
}

const props = withDefaults(defineProps<Props>(), {
  error: false,
  rounded: 'sm',
  accentColor: 'accent-primary',
})

const isKeyboardMode = useIsKeyboardMode()
const slots = useSlots()
const { stylingAttrs, nonStylingAttrs } = useStylingAttributes()
const { isDarkColor } = useColor()
const { getThemeColor } = useTheme()

const getBackgroundColor = (isChecked: boolean) => {
  if (isChecked) {
    if (props.error) {
      return getThemeColor('error')
    }

    return getThemeColor(props.accentColor)
  }

  return getThemeColor('bg-primary')
}

const getBorderColor = (isChecked: boolean, isFocused: boolean) => {
  if (props.error) {
    return getThemeColor('error')
  }

  if (isChecked || isFocused) {
    return getThemeColor(props.accentColor)
  }

  return getThemeColor('border-input')
}

const getTickColor = () => (isDarkColor(getThemeColor(getBackgroundColor(true))) ? '#fff' : '#000')
</script>

<template>
  <CheckboxProvider
    v-slot="{ Component, props: providedProps, isChecked, isFocused }"
    v-bind="nonStylingAttrs"
    :model-value="modelValue"
    :value="value"
  >
    <Component
      v-bind="stylingAttrs"
      :is="slots.default ? 'label' : 'div'"
      class="flex items-center"
    >
      <Component
        :is="Component"
        :class="[
          {
            'focus:ring': isKeyboardMode,
            'opacity-50': providedProps.isDisabled,
          }
        ]"
        :style="{
          backgroundColor: getBackgroundColor(isChecked),
          borderColor :getBorderColor(isChecked, isFocused),
          borderRadius: useBorderRadius()
        }"
        class="border
        border-solid
        duration-200
        flex
        h-[1.125em]
        items-center
        justify-center
        w-[1.125em]"
      >
        <Transition name="tick-transition">
          <div v-if="isChecked">
            <Icon
              :icon="Svg.TICK"
              :style="{
                color: getTickColor()
              }"
              class="h-[0.6875em] w-[0.6875em]"
            />
          </div>
        </Transition>
      </Component>

      <span
        v-if="slots.default"
        :class="[
          error ? 'text-error' : 'text-secondary',
          {
            'opacity-50': providedProps.isDisabled,
          }
        ]"
        class="ml-2"
      >
        <slot
          :is-checked="isChecked"
          :is-focused="isFocused"
          :is-disabled="providedProps.isDisabled"
          :error="error"
        />
      </span>
    </Component>
  </CheckboxProvider>
</template>

<style scoped lang="scss">
.tick-transition {
  &-enter-active,
  &-leave-active {
    transition: 0.3s cubic-bezier(0.22, 0.68, 0, 1.51);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }
}
</style>
