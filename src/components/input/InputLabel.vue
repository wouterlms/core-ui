<script setup lang="ts">
import {
  computed,
  defineProps,
  withDefaults,
} from 'vue'

import { colors } from '@/theme'

export interface Props {
  error: boolean
  isDisabled: boolean
  isFocused: boolean
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  borderColor: undefined,
})

const color = computed(() => {
  if (props.isDisabled) {
    return colors.value.text.inputDisabled
  }

  if (props.error) {
    return colors.value.accent.error
  }

  return colors.value.text.input
})

const borderColor = computed(() => {
  if (props.error) {
    return colors.value.accent.error
  }

  if (props.isFocused) {
    return colors.value.accent.primary
  }

  return props.borderColor ?? colors.value.border.input
})

const backgroundColor = computed(() => {
  if (props.isDisabled) {
    return colors.value.background.inputDisabled
  }

  return colors.value.background.input
})
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
  <label
    :class="[
      {
        'opacity-50': props.isDisabled,
        'border-error': !!error
      }
    ]"
    :style="{
      borderColor,
      color,
      backgroundColor,
    }"
    class="border border-solid duration-200 flex items-center"
  >
    <slot :color="color" />
  </label>
</template>
