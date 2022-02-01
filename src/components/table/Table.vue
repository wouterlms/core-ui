<script setup lang="ts">
import { provide } from 'vue'

interface Props {
  grid: string
}

const props = withDefaults(defineProps<Props>(), {

})

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
