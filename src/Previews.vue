<script setup lang="ts">
import Tooltip from '@/components/tooltip-v2/Tooltip.vue'
import { ref } from 'vue'

const parent = ref()
</script>

<template>
  <div class="h-[200vh] p-48">
    <div
      ref="parent"
      class="border border-solid h-48 mt-[100vh]"
    >
      parent
      <Tooltip
        :margin="0"
        :offset="0"
        :inherit-width="true"
        position="bottom"
      >
        <div class="bg-red-200 p-2">
          tooltip content
        </div>
      </Tooltip>
    </div>
  </div>
</template>
