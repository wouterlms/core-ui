<script setup lang="ts">
import Test from './Test.vue'
import Index from './Index.vue'

import { useTheme } from './composables'

const { createTheme } = useTheme()

createTheme()
</script>

<template>
  <Index />
  <Test />
</template>
