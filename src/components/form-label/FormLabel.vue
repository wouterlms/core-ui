<script setup lang="ts">
interface Props {
  label: string
}

withDefaults(defineProps<Props>(), {})
</script>

<template>
  <label class="flex flex-col">
    <span class="mb-0.5 text-secondary text-xs">
      {{ label }}
    </span>
    <slot />
  </label>
</template>
