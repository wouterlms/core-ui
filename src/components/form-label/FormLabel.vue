<script setup lang="ts">
interface Props {
  label?: string
  error?: string | boolean | null | undefined
  position?: 'top' | 'bottom'
}

withDefaults(defineProps<Props>(), {
  label: undefined,
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
      <template v-if="label">{{ label }}</template>
      <template v-if="label && typeof error === 'string'">&nbsp;|&nbsp;</template>
      <template v-if="typeof error === 'string'">{{ error }}</template>
    </span>

    <slot />
  </label>
</template>
