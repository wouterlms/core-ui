<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue'

import { colors } from '@/utils'

export interface Props {
  error: boolean
  isDisabled: boolean
  isFocused: boolean
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  borderColor: colors.border.input,
})

const color = computed(() => {
  if (props.isDisabled) {
    return 'text-input-disabled'
  }

  if (props.error) {
    return 'text-error'
  }

  return 'text-input'
})

const borderColor = computed(() => {
  if (props.error) {
    return colors.accent.error
  }

  if (props.isFocused) {
    return colors.accent.primary
  }

  return props.borderColor
})

const backgroundColor = computed(() => {
  if (props.isDisabled) {
    return 'bg-input-disabled'
  }

  return 'bg-input'
})
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
  <label
    :class="[
      color,
      backgroundColor,
      {
        'opacity-50': props.isDisabled,
        'border-error': !!error
      }
    ]"
    :style="{
      borderColor
    }"
    class="border border-solid duration-200 flex items-center"
  >
    <slot :color="color" />
  </label>
</template>
