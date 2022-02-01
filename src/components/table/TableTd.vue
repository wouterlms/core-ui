<script setup lang="ts">
interface Props {
  truncate?: boolean
}

withDefaults(defineProps<Props>(), {
  truncate: true,
})
</script>

<template>
  <div
    :class="{
      'truncate leading-5': truncate,
    }"
    class="text-secondary text-sm"
  >
    <slot />
  </div>
</template>
