<script setup lang="ts">
import {
  computed,
  h,
  ref,
  toRef,
  useAttrs,
  useSlots,
} from 'vue'

import { useVModel } from '@/composables'

import { CheckboxValue } from '@/types'

interface Props {
  /**
   * @model
   */
  modelValue: CheckboxValue

  /**
   * Checkbox value
   */
  value: CheckboxValue

  /**
   * Disable checkbox
   */
  isDisabled?: boolean

  /**
   * Readonly checkbox
   */
  isReadonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
  isReadonly: false,
  rounded: 'sm',
})

const checkboxValue = useVModel(toRef(props, 'modelValue'))

const attrs = useAttrs()
const slots = useSlots()

const isFocused = ref(false)

const isChecked = computed({
  get() {
    if (checkboxValue.value instanceof Array) {
      return checkboxValue.value.map((v) => JSON.stringify(v)).includes(JSON.stringify(props.value))
    }
    return !!checkboxValue.value
  },
  set(checked: CheckboxValue) {
    if (props.isReadonly) {
      return
    }

    if (checkboxValue.value instanceof Array) {
      const index = checkboxValue.value.findIndex((entry) => JSON.stringify(entry)
      === JSON.stringify(props.value))

      if (index === -1) {
        checkboxValue.value.push(props.value)
      } else {
        checkboxValue.value.splice(index, 1)
      }
    } else {
      checkboxValue.value = checked
    }
  },
})

const toggle = () => {
  isChecked.value = !isChecked.value
}

const input = computed(() => {
  const {
    isDisabled,
    isReadonly,
  } = props

  return h('button', {
    ...attrs,
    type: 'button',
    role: 'checkbox',
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
    onClick: toggle,
    onKeydown: (e: KeyboardEvent) => {
      const { code } = e

      if (code === 'Space') {
        toggle()
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
