<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

import Button from '../button/Button.vue'

export interface Props {
  isSecondaryAction?: boolean
}

withDefaults(defineProps<Props>(), {
  isSecondaryAction: false,
})
</script>

<template>
  <Button
    v-if="isSecondaryAction"
    variant="ghost"
    rounded="md"
    class="!block hover:underline mx-auto w-full"
  >
    <slot />
  </Button>

  <Button
    v-else
    rounded="md"
    class="w-full"
  >
    <slot />
  </Button>
</template>
