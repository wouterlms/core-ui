<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

export interface Props {
  truncate?: boolean
}

withDefaults(defineProps<Props>(), {
  truncate: true,
})
</script>

<template>
  <div
    :class="{
      'truncate leading-5': truncate,
    }"
    class="text-secondary text-sm"
  >
    <slot />
  </div>
</template>
