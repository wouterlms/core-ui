<script setup lang="ts">
import {
  ComputedRef,
  Ref,
  computed,
  provide,
  readonly,
  ref,
  toRef,
} from 'vue'

import {
  useEventListener,
  useVModel,
} from '@wouterlms/composables'

import {
  useDescendants,
} from '@/composables'

import { key } from './useSelect'

interface Props {
  /**
   * @model
   */
  modelValue: unknown

  /**
   *
   */
  isDropdownVisible: boolean

  /**
   * HTMLElement which wraps the options. Used to scroll to an option
   * when not completely visible
   */
  optionsEl: Omit<HTMLHtmlElement, 'version'> | null
}

const props = withDefaults(defineProps<Props>(), {})

/* eslint-disable-next-line */
const emit = defineEmits<{
  (event: 'update:modelValue', option: unknown): void
  (event: 'focus'): void
  (event: 'blur'): void
  (event: 'optionSelected', option: unknown): void
  (event: 'optionDeselected', option: unknown): void
}>()

const value = useVModel(toRef(props, 'modelValue'))

const multiple = computed(() => Array.isArray(value.value))

/**
 * Options might not be in sync with the original array
 *
 * E.g. when filterable, if `Option A` at index 0 is unmounted, and then
 * remounted, it will be appended at the end, thus losing
 * its original position
 *
 * Instead of pushing & splicing, `isRendered` is used
 */
const options = ref([]) as Ref<{
  option: unknown,
  isDisabled: ComputedRef<boolean>
  isRendered: boolean
}[]>

const { activeDescendantOption } = useDescendants(
  options,
  computed(() => props.optionsEl),
  {
    disabled: computed(() => !props.isDropdownVisible),
  }
)

const selectOption = (option: unknown) => {
  if (multiple.value) {
    const index = (value.value as Array<unknown>).findIndex((existingOption) => (
      JSON.stringify(existingOption) === JSON.stringify(option)
    ))

    if (index === -1) {
      (value.value as Array<unknown>).push(option)
      emit('optionSelected', option)
    } else {
      (value.value as Array<unknown>).splice(index, 1)
      emit('optionDeselected', option)
    }
  } else {
    value.value = option
    emit('optionSelected', option)
  }
}

const registerOption = (
  option: { option: unknown, isDisabled: ComputedRef<boolean> }
) => {
  const index = options.value.findIndex(({ option: o }) => (
    JSON.stringify(o) === JSON.stringify(option.option)
  ))

  if (index !== -1) {
    options.value[index].isRendered = true
  } else {
    options.value.push({
      ...option,
      isRendered: true,
    })
  }
}

const unregisterOption = (option: unknown) => {
  const index = options.value.findIndex(({ option: o }) => (
    JSON.stringify(o) === JSON.stringify(option)
  ))

  if (index === -1) {
    // This happens, but I don't know why
  } else {
    options.value[index].isRendered = false
  }
}

// Prevent form submit on enter
useEventListener('keydown', (e: KeyboardEvent) => {
  const { key } = e

  if (key === 'Enter' && props.isDropdownVisible) {
    e.preventDefault()
  }
})

useEventListener('keyup', (e: KeyboardEvent) => {
  const { key } = e

  if (key === 'Enter' && props.isDropdownVisible && activeDescendantOption.value) {
    e.preventDefault()
    e.stopImmediatePropagation()

    selectOption(activeDescendantOption.value.option)
  }
})

provide(key, {
  selectOption,
  registerOption,
  unregisterOption,
  selected: readonly(value),
  activeDescendantOption,
})
</script>

<template>
  <slot
    :props="props"
    :options="options"
    :multiple="multiple"
  />
</template>
