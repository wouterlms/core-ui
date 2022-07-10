<script setup lang="ts">
import {
  computed,
  defineProps,
  withDefaults,
} from 'vue'

import { colors } from '@/theme'

export interface Props {
  is?: string

  /**
   * Label text
   */
  label?: string

  /**
   * Error message, or boolean to show title in red
   */
  error?: string | boolean | null | undefined

  /**
   * Label position
   */
  position?: 'top' | 'bottom'

  /**
   * Label text color
   */
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  is: 'label',
  label: undefined,
  error: undefined,
  position: 'top',
  textColor: undefined,
})

const computedColor = computed(() => (
  typeof props.error === 'string' || props.error === true
    ? colors.value.accent.red
    : props.textColor ?? colors.value.text.secondary
))
</script>

<template>
  <Component
    :is="is"
    :class="[
      position === 'bottom' ? 'flex-col-reverse' : 'flex-col'
    ]"
    class="flex"
  >
    <span
      :class="[
        position === 'bottom' ? 'mt-[0.3em]' : 'mb-[0.3em]'
      ]"
      :style="{
        color: computedColor
      }"
      class="text-[0.875em]"
    >
      <template v-if="label">{{ label }}</template>
      <template v-if="label && typeof error === 'string'">&nbsp;|&nbsp;</template>
      <template v-if="typeof error === 'string'">{{ error }}</template>
    </span>

    <slot />
  </Component>
</template>
