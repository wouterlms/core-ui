<script setup lang="ts">
import Tooltip from '@/components/tooltip-v2/Tooltip.vue'
import { ref } from 'vue'

const parent = ref()
</script>

<template>
  <div class="p-48">
    <div class="h-[100vh]" />

    <div class="p-0">
      <div
        ref="parent"
        class="border border-red-500 border-solid p-8"
      >
        <Tooltip
          :show="true"
          :margin="0"
          :offset="0"
          :inherit-width="false"
          :show-arrow="true"
          :container="parent"
          position="left"
        >
          <div class="p-2">
            tooltip content
          </div>
        </Tooltip>
      </div>
    </div>

    <div class="h-[100vh]" />
  </div>
</template>
