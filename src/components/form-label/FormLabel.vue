<script setup lang="ts">
interface Props {
  label: string
  error?: string
}

withDefaults(defineProps<Props>(), {
  error: undefined,
})
</script>

<template>
  <label class="flex flex-col">
    <span
      :class="[
        !!error ? 'text-error' : 'text-secondary'
      ]"
      class="mb-0.5 text-xs"
    >
      {{ label }}
      <template v-if="!!error">| {{ error }}</template>
    </span>
    <slot />
  </label>
</template>
