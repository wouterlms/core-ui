<script setup lang="ts">
import {
  defineProps,
  withDefaults,
} from 'vue'

import useSegment, { Props as BaseProps } from './useSegment'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Props extends BaseProps {}

withDefaults(defineProps<Props>(), {})

const { Component, state } = useSegment()
</script>

<template>
  <Component
    :is="Component"
    :class="[
      state.isSelected ? 'text-primary' : 'text-tertiary'
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
</template>
