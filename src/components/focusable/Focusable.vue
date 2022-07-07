<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

import { useIsKeyboardMode } from '@/composables'

export interface Props {
  // eslint-disable-next-line @typescript-eslint/ban-types
  is?: string | Object
}

withDefaults(defineProps<Props>(), {
  is: 'button',
})

const isKeyboardMode = useIsKeyboardMode()
</script>

<template>
  <Component
    :is="is"
    :class="{
      'focus:ring': isKeyboardMode
    }"
    type="button"
    class="duration-200 rounded"
  >
    <slot />
  </Component>
</template>
