<script setup lang="ts">
import { defineProps, provide, withDefaults } from 'vue'

export interface Props {
  grid: string
}

const props = withDefaults(defineProps<Props>(), {})

provide('grid', props.grid)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <slot />
</template>
