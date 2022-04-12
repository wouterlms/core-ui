<script setup lang="ts">
import {
  computed,
  defineProps,
  h,
  ref,
  toRef,
  useAttrs,
  useSlots,
  withDefaults,
} from 'vue'

import { useVModel } from '@wouterlms/composables'

interface Props {
  /**
   * @model
   */
  modelValue: unknown

  /**
   * Radio value
   */
  value: unknown

  /**
   * Disable radio input
   */
  isDisabled?: boolean

  /**
   * Readonly input
   */
  isReadonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
  isReadonly: false,
  rounded: 'sm',
})

const radioValue = useVModel(toRef(props, 'modelValue'))

const attrs = useAttrs()
const slots = useSlots()

const isFocused = ref(false)

const isChecked = computed(() => JSON.stringify(radioValue.value) === JSON.stringify(props.value))

const select = () => {
  if (!props.isReadonly) {
    radioValue.value = props.value
  }
}

const input = computed(() => {
  const {
    isDisabled,
    isReadonly,
  } = props

  return h('button', {
    ...attrs,
    type: 'button',
    role: 'radio',
    disabled: isDisabled,
    readonly: isReadonly,
    ariaChecked: isChecked,
    ariaDisabled: isDisabled,
    class: [
      {
        'cursor-not-allowed': isDisabled,
        'cursor-default': isReadonly,
      }
    ],
    onClick: select,
    onKeydown: (e: KeyboardEvent) => {
      const { code } = e

      if (code === 'Space') {
        select()
        e.preventDefault()
      }
    },
    onFocus: () => {
      isFocused.value = true
    },
    onBlur: () => {
      isFocused.value = false
    },
  }, slots.default)
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <slot
    :Component="input"
    :props="props"
    :is-checked="!!isChecked"
    :is-focused="isFocused"
  />
</template>
