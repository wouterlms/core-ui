<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

import SegmentProvider from './SegmentProvider.vue'

interface Props {
  segment: unknown
}

withDefaults(defineProps<Props>(), {})
</script>

<template>
  <SegmentProvider
    v-slot="{ Component, isSelected }"
    :segment="segment"
  >
    <Component
      :is="Component"
      :class="[
        isSelected ? 'text-primary' : 'text-tertiary'
      ]"
      class="duration-200
        px-[1.4em]
        py-[0.25rem]
        relative
        rounded-sm
        text-sm
        whitespace-nowrap
        z-[1]"
    >
      <slot />
    </Component>
  </SegmentProvider>
</template>
