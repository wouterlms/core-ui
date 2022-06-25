<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue'

import { colors } from '@/utils'

export interface Props {
  is?: string
  label?: string
  error?: string | boolean | null | undefined
  position?: 'top' | 'bottom'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  is: 'label',
  label: undefined,
  error: undefined,
  position: 'top',
  color: colors.text.secondary,
})

const computedColor = computed(() => (
  typeof props.error === 'string' || props.error === true
    ? colors.accent.error
    : props.color
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
