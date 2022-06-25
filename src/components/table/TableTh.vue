<script setup lang="ts">
import {
  Ref,
  defineProps,
  inject,
  withDefaults,
} from 'vue'

export interface Props {
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
    class="bg-secondary
      border-b
      border-solid
      border-tertiary
      flex-shrink-0
      gap-4
      grid
      p-4
      sticky
      text-secondary
      top-0
      z-[1]"
  >
    <slot />
  </Component>
</template>
