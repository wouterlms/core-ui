<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

import { ButtonVariant, Rounded } from '@/enums'

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
    :variant="ButtonVariant.GHOST"
    :rounded="Rounded.MD"
    class="!block hover:underline mx-auto w-full"
  >
    <slot />
  </Button>

  <Button
    v-else
    :rounded="Rounded.MD"
    class="w-full"
  >
    <slot />
  </Button>
</template>
