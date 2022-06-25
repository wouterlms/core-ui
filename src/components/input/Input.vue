<script setup lang="ts">
import {
  defineProps,
  withDefaults,
} from 'vue'

import {
  useBorderRadius,
  useStylingAttributes,
} from '@/composables'

import { BorderRadius } from '@/types'
import { Svg, colors } from '@/utils'

import Button from '../button/Button.vue'
import Icon from '../icon/Icon.vue'
import InputLabel from './InputLabel.vue'
import InputProvider from './InputProvider.vue'
import Loader from '../loader/Loader.vue'

export interface Props {
  modelValue: string | number | null
  error?: boolean
  iconLeft?: Svg
  iconRight?: Svg
  iconLeftSize?: string
  iconRightSize?: string
  borderColor?: string

  padding?: string,
  rounded?: BorderRadius
}

withDefaults(defineProps<Props>(), {
  error: false,
  iconLeft: undefined,
  iconRight: undefined,
  iconLeftSize: '0.9375em',
  iconRightSize: '0.9375em',
  borderColor: colors.border.input,

  padding: '0.5em',
  rounded: 'default',
})

const { stylingAttrs, nonStylingAttrs } = useStylingAttributes()

const getIconColor = (error: boolean) => (
  error
    ? colors.accent.error
    : colors.text.tertiary
)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <InputProvider
    v-slot="{
      Component,
      props: providedProps,
      isFocused,
      isPasswordVisible,
      togglePassword
    }"
    v-bind="nonStylingAttrs"
    :model-value="modelValue"
  >
    <InputLabel
      v-slot="{ color }"
      v-bind="stylingAttrs"
      :error="!!error"
      :is-disabled="providedProps.isDisabled"
      :is-focused="isFocused"
      :border-color="borderColor"
      :style="{
        borderRadius: useBorderRadius()
      }"
    >
      <Icon
        v-if="iconLeft"
        :icon="iconLeft"
        :style="{
          width: iconLeftSize,
          height: iconLeftSize,
          color: getIconColor(error),
        }"
        class="flex-shrink-0 ml-[0.625em]"
      />

      <slot name="left" />

      <slot
        v-if="$slots.input"
        name="input"
      />

      <Component
        :is="Component"
        :class="{
          'absolute opacity-0 pointer-events-none': $slots.input
        }"
        :style="{
          padding,
        }"
        class="w-full"
      />

      <slot name="right" />

      <Loader
        v-if="providedProps.isLoading"
        :accent-color="colors.text.input"
        class="mr-[0.5em] text-[0.875em]"
      />

      <Icon
        v-else-if="iconRight"
        :icon="iconRight"
        :class="[getIconColor(error)]"
        :style="{
          width: iconRightSize,
          height: iconRightSize,
        }"
        class="flex-shrink-0 mr-[0.625em]"
      />

      <Button
        v-else-if="providedProps.type === 'password'"
        :icon-left="isPasswordVisible ? Svg.CORE_EYE_HIDE : Svg.CORE_EYE_VIEW"
        :is-disabled="providedProps.isDisabled || providedProps.isReadonly"
        :color-scheme="color"
        variant="ghost"
        rounded="sm"
        padding="0.2em"
        class="mr-[0.5em]"
        @click="togglePassword"
      />
    </InputLabel>
  </InputProvider>
</template>

<style scoped lang="scss">
:deep input,
:deep textarea {
  &::placeholder {
    @apply text-input-placeholder text-[0.875em];
    // @apply text-[0.875em] text-input-placeholder font-light;
  }
}
</style>
