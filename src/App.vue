<script setup lang="ts">
import SelectV2 from '@/components/select-v2/Select.vue'

import {
  createTheme,
} from './theme'

createTheme({
  enableDarkMode: true,
  colors: {
    accent: {
      test: '#ff00ff',
    },
  },
  icons: {},
})
</script>

<template>
  <div class="p-8">
    <SelectV2 class="w-72" />
  </div>
</template>
