<script setup lang="ts">
import { toRef } from 'vue'

import { useVModel } from '@wouterlms/composables'

import { useStylingAttributes } from '@/composables'

import SegmentedControlProvider from './SegmentedControlProvider.vue'

interface Props {
  modelValue: unknown
}

const props = withDefaults(defineProps<Props>(), {})

const value = useVModel(toRef(props, 'modelValue'))
const { stylingAttrs, nonStylingAttrs } = useStylingAttributes()
</script>

<template>
  <SegmentedControlProvider
    v-slot="{ style }"
    v-model="value"
    v-bind="nonStylingAttrs"
  >
    <div
      v-bind="stylingAttrs"
      class="bg-gray-primary dark:bg-primary inline-flex p-1 rounded"
    >
      <div class="relative">
        <div
          :style="style"
          class="bg-primary dark:bg-tertiary h-full rounded-sm shadow"
        />

        <slot />
      </div>
    </div>
  </SegmentedControlProvider>
</template>
