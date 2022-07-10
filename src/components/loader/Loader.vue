<script setup lang="ts">
import {
  computed,
  defineProps,
  withDefaults,
} from 'vue'

import { colors } from '@/theme'

export interface Props {
  /**
   * Accent color
   */
  accentColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: undefined,
})

const computedAccentColor = computed(() => (
  props.accentColor ?? colors.value.accent.primary
))
</script>

<template>
  <div class="flex h-[1.75em] items-center justify-center relative w-[1.75em]">
    <div class="h-full left-1/2 relative top-1/2 w-full">
      <span
        v-for="i of 12"
        :key="i"
        :style="{
          transform: `rotate(${12 - i * 30}deg) translate(146%)`,
          animationDelay: `${-i * 0.1 - 1.2}s`,
          backgroundColor: computedAccentColor
        }"
        class="-left-[10%] -top-[3.9%] absolute animate h-[0.1em] rounded w-[24%]"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.animate {
  animation: 1.2s linear 0s infinite normal none running spinner
}

@keyframes spinner {
  0% {
    opacity: 1
  }
  100% {
    opacity: 0.15
  }
}
</style>
