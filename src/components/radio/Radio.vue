<script setup lang="ts">
import {
  useIsKeyboardMode,
  useStylingAttributes,
  useTheme,
} from '@/composables'
import { useSlots } from 'vue'

import RadioProvider from './RadioProvider.vue'

interface Props {
  modelValue: unknown
  value: unknown
  error?: boolean
  accentColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  error: false,
  accentColor: 'accent-primary',
})

const isKeyboardMode = useIsKeyboardMode()
const slots = useSlots()
const { getThemeColor } = useTheme()
const { stylingAttrs, nonStylingAttrs } = useStylingAttributes()

const getBorderColor = (isChecked: boolean, isFocused: boolean) => {
  if (props.error) {
    return getThemeColor('error')
  }

  if (isChecked || isFocused) {
    return getThemeColor(props.accentColor)
  }

  return getThemeColor('border-input')
}

const getDotColor = () => {
  if (props.error) {
    return getThemeColor('error')
  }

  return getThemeColor(props.accentColor)
}
</script>

<template>
  <RadioProvider
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
          borderColor: getBorderColor(isChecked, isFocused),
        }"
        class="bg-primary
        border
        border-solid
        duration-200
        flex
        flex-shrink-0
        h-[1.125em]
        items-center
        justify-center
        rounded-full
        w-[1.125em]"
      >
        <Transition name="dot-transition">
          <div v-if="isChecked">
            <div
              :style="{
                backgroundColor: getDotColor()
              }"
              class="h-[0.5em] rounded-full w-[0.5em]"
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
        <slot />
      </span>
    </Component>
  </RadioProvider>
</template>

<style scoped lang="scss">
.dot-transition {
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
