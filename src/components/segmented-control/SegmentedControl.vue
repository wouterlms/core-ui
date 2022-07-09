<script setup lang="ts">
import {
  defineProps,
  withDefaults,
} from 'vue'

import useSegmentedControl, { Props as BaseProps } from './useSegmentedControl'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Props extends BaseProps {}

withDefaults(defineProps<Props>(), {})

const { Component, state } = useSegmentedControl()
</script>

<template>
  <Component :is="Component">
    <div
      class="bg-gray-primary dark:bg-primary inline-flex p-1 rounded"
    >
      <div class="relative">
        <div
          :style="state.style"
          class="bg-primary dark:bg-tertiary h-full rounded-sm shadow"
        />

        <slot />
      </div>
    </div>
  </Component>
</template>
