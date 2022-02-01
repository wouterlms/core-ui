<script setup lang="ts">
import {
  computed,
  h,
  ref,
  toRef,
  useAttrs,
} from 'vue'

import { useVModel } from '@/composables'

export interface Props {
  /**
   * @model
   */
  modelValue: string | number | null

  /**
   * Readonly input
   */
  isReadonly?: boolean

  /**
   * Disable input
   */
  isDisabled?: boolean

  /**
   * When `true` it will disable the input
   */
  isLoading?: boolean

  /**
   * Native spellcheck, defaults to false
   */
  spellcheck?: boolean

  /**
   * Autofocus input on mount
   */
  autofocus?: boolean

  /**
   * Native button types + `textarea`
   */
  type?: 'text' | 'number' | 'password' | 'email' | 'textarea',
}

const props = withDefaults(defineProps<Props>(), {
  isReadonly: false,
  isDisabled: false,
  isLoading: false,
  spellcheck: false,
  autofocus: false,
  type: 'text',
  placeholder: undefined,
})

/* eslint-disable-next-line */
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number | null): void
  (event: 'focus'): void
  (event: 'blur'): void
}>()

enum ComponentType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
}

const value = useVModel(toRef(props, 'modelValue'))
const attrs = useAttrs()

const isPasswordVisible = ref(false)
const isFocused = ref(false)

const component = computed(() => {
  if (props.type === ComponentType.TEXTAREA) {
    return ComponentType.TEXTAREA
  }

  return ComponentType.INPUT
})

const inputType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password'
  }

  return props.type
})

const togglePassword = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const clearInputValue = () => {
  value.value = null
}

const input = computed(() => {
  const {
    isLoading,
    isDisabled,
    isReadonly,
    spellcheck,
  } = props

  return h(component.value, {
    ...attrs,
    spellcheck,
    type: inputType.value,
    value: value.value,
    disabled: isLoading || isDisabled,
    readonly: isReadonly,
    class: [
      'bg-transparent', {
        'cursor-not-allowed': isLoading || isDisabled,
        'cursor-default': isReadonly,
      }
    ],
    onInput: (e: InputEvent) => {
      const element = e.currentTarget as HTMLInputElement
      value.value = element.value
    },
    onFocus: () => {
      isFocused.value = true
      emit('focus')
    },
    onBlur: () => {
      isFocused.value = false
      emit('blur')
    },
    onVnodeMounted: (e) => {
      if (props.autofocus) {
        e.el?.focus()
      }
    },
  })
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <slot
    :props="props"
    :Component="input"
    :is-focused="isFocused"
    :is-password-visible="isPasswordVisible"
    :toggle-password="togglePassword"
    :clear-input-value="clearInputValue"
  />
</template>
