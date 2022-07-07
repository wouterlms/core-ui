<script setup lang="ts">
import {
  ComputedRef,
  computed,
  defineProps,
  onBeforeUnmount,
  reactive,
  withDefaults,
} from 'vue'

import { useSelect } from './useSelect'

export interface Props {
  /**
   * Option value
   */
  value: unknown

  /**
   * Whether option is disabled
   */
  isDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false, // Does not work yet with `useDescendants`
})

const {
  selectOption,
  registerOption,
  unregisterOption,
  selected,
  activeDescendantOption,
} = useSelect()

const multiple = computed(() => Array.isArray(selected.value))

const isSelected = computed(() => {
  if (multiple.value) {
    return (selected.value as Array<unknown>).some((selectedOption) => (
      JSON.stringify(selectedOption) === JSON.stringify(props.value)
    ))
  }

  return selected.value !== null && JSON.stringify(selected.value) === JSON.stringify(props.value)
})

const isActiveDescendant = computed<boolean>(
  () => activeDescendantOption.value !== undefined
  && JSON.stringify(activeDescendantOption.value.option) === JSON.stringify(props.value)
)

registerOption(reactive({
  option: props.value,
  isDisabled: computed(() => props.isDisabled),
}) as unknown as { option: unknown, isDisabled: ComputedRef<boolean> })

onBeforeUnmount(() => {
  unregisterOption(props.value)
})
</script>

<template>
  <button
    type="button"
    role="option"
    :value="(value as any)"
    :aria-selected="isSelected"
    :tabindex="-1"
    :disabled="isDisabled"
    @keydown.enter.prevent
    @click="selectOption(value)"
  >
    <slot
      :is-selected="isSelected"
      :is-active-descendant="isActiveDescendant"
      :is-disabled="isDisabled"
      :multiple="multiple"
    />
  </button>
</template>
