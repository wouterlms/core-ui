<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue'

interface Props {
  error: boolean
  isDisabled: boolean
  isFocused: boolean
}

const props = withDefaults(defineProps<Props>(), {})

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
    return 'border-error'
  }

  if (props.isFocused) {
    return 'border-accent-primary'
  }

  return 'border-input'
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
      borderColor,
      backgroundColor,
      {
        'opacity-50': props.isDisabled,
        'border-error': !!error
      }
    ]"
    class="border border-solid duration-200 flex items-center"
  >
    <slot :color="color" />
  </label>
</template>
