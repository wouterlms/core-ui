<script setup lang="ts">
import {
  computed,
  defineProps,
  withDefaults,
} from 'vue'

import {
  useBorderRadius,
  useComponentAttrs,
} from '@/composables'

import { BorderRadius } from '@/types'
import { Svg, colors } from '@/theme'

import Button from '../button/Button.vue'
import Icon from '../icon/Icon.vue'
import InputLabel from './InputLabel.vue'
import Loader from '../loader/Loader.vue'

import useInput, { Props as BaseProps } from './useInput'

export interface Props extends BaseProps {
  error?: boolean
  iconLeft?: Svg
  iconRight?: Svg
  iconLeftSize?: string
  iconRightSize?: string
  borderColor?: string

  padding?: string,
  rounded?: BorderRadius
}

const props = withDefaults(defineProps<Props>(), {
  error: false,
  iconLeft: undefined,
  iconRight: undefined,
  iconLeftSize: '0.9375em',
  iconRightSize: '0.9375em',
  borderColor: colors.value.border.input,

  padding: '0.5em',
  rounded: 'default',
})

/* eslint-disable-next-line */
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number | null): void
  (event: 'focus'): void
  (event: 'blur'): void
}>()

const {
  Component,
  state,
  togglePassword,
} = useInput(emit)

const { getListenerAttrs } = useComponentAttrs()

const listenerAttrs = getListenerAttrs()

const computedBorderColor = computed(
  () => props.borderColor ?? colors.value.border.input,
)

const iconColor = computed(() => {
  if (props.error) {
    return colors.value.accent.error
  }

  return colors.value.text.tertiary
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <InputLabel
    v-slot="{ color }"
    :error="!!error"
    :is-disabled="state.isDisabled"
    :is-focused="state.isFocused"
    :border-color="computedBorderColor"
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
        color: iconColor,
      }"
      class="flex-shrink-0 ml-[0.625em]"
    />

    <slot name="left" />

    <slot
      v-if="$slots.input"
      name="input"
    />

    <Component
      v-bind="listenerAttrs"
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
      v-if="state.isLoading"
      :accent-color="colors.text.input"
      class="mr-[0.5em] text-[0.875em]"
    />

    <Icon
      v-else-if="iconRight"
      :icon="iconRight"
      :style="{
        width: iconRightSize,
        height: iconRightSize,
        color: iconColor,
      }"
      class="flex-shrink-0 mr-[0.625em]"
    />

    <Button
      v-else-if="state.type === 'password'"
      :icon-left="state.isPasswordVisible ? Svg.CORE_EYE_HIDE : Svg.CORE_EYE_VIEW"
      :is-disabled="state.isDisabled || state.isReadonly"
      :color-scheme="color"
      variant="ghost"
      rounded="sm"
      padding="0.2em"
      class="mr-[0.5em]"
      @click="togglePassword"
    />
  </InputLabel>
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
