<script setup lang="ts">
import {
  Ref,
  defineProps,
  inject,
  withDefaults,
} from 'vue'

interface Props {
  is?: string
}

withDefaults(defineProps<Props>(), {
  is: 'div',
})

const grid = inject('grid') as Ref<string>
</script>

<template>
  <Component
    :is="is"
    :style="{
      'grid-template-columns': grid,
    }"
    class="border-b
      border-solid
      border-tertiary
      gap-4
      grid
      items-center
      last:border-none
      p-4
      text-secondary"
  >
    <slot />
  </Component>
</template>
