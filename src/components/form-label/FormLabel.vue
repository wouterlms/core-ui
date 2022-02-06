<script setup lang="ts">
interface Props {
  label: string
  error?: string | boolean | null | undefined
  position?: 'top' | 'bottom'
}

withDefaults(defineProps<Props>(), {
  error: undefined,
  position: 'top',
})
</script>

<template>
  <label
    :class="[
      position === 'bottom' ? 'flex-col-reverse' : 'flex-col'
    ]"
    class="flex"
  >
    <span
      :class="[
        !!error ? 'text-error' : 'text-secondary',
        position === 'bottom' ? 'mt-0.5' : 'mb-0.5'
      ]"
      class="text-xs"
    >
      {{ label }}
      <template v-if="typeof error === 'string'">| {{ error }}</template>
    </span>

    <slot />
  </label>
</template>
