<script setup lang="ts">
import { useTheme } from '@/composables'
import { computed, defineProps, withDefaults } from 'vue'

interface Props {
  error: boolean
  isDisabled: boolean
  isFocused: boolean
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  borderColor: 'border-input',
})

const { getThemeColor } = useTheme()

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
    return getThemeColor('border-error')
  }

  if (props.isFocused) {
    return getThemeColor('border-accent-primary')
  }

  return getThemeColor(props.borderColor)
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
