<script setup lang="ts">
interface Props {
  label: string
  error?: string | boolean | null | undefined
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
      <template v-if="typeof error === 'string'">| {{ error }}</template>
    </span>
    <slot />
  </label>
</template>
