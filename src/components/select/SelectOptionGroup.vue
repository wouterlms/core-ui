<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

import { useIsMobileDevice } from '@wouterlms/composables'

interface Props {
  label: string
}

withDefaults(defineProps<Props>(), {})

const isMobileDevice = useIsMobileDevice()
</script>

<template>
  <optgroup
    v-if="isMobileDevice"
    :label="label"
  >
    <slot />
  </optgroup>

  <div
    v-else
    class="flex flex-col"
  >
    <span class="p-3 text-secondary text-xs">
      {{ label }}
    </span>

    <slot />
  </div>
</template>
