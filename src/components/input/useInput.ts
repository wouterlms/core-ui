import {
  computed,
  h,
  ref,
  toRef,
  useAttrs,
} from 'vue'

import { usePropsWithDefaults } from '@/composables'
import { useVModel } from '@wouterlms/composables'

enum ComponentType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
}

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
  type?: 'text' | 'number' | 'password' | 'email' | 'date' | 'time' | 'textarea'

  /**
   * Textarea height
   */
  textareaHeight?: string
}

interface Emit {
  (event: 'update:modelValue', value: string | number | null): void
  (event: 'focus'): void
  (event: 'blur'): void
}

export const defaultProps = {
  isReadonly: false,
  isDisabled: false,
  isLoading: false,
  spellcheck: false,
  autofocus: false,
  type: 'text',
  placeholder: undefined,
  textareaHeight: '6em',
}

export default (emit: Emit) => {
  const props = usePropsWithDefaults(defaultProps, useAttrs() as unknown as Props)

  const value = useVModel(toRef(props.value, 'modelValue'))
  const isPasswordVisible = ref(false)
  const isFocused = ref(false)

  const component = computed(() => {
    if (props.value.type === ComponentType.TEXTAREA) {
      return ComponentType.TEXTAREA
    }

    return ComponentType.INPUT
  })

  const inputType = computed(() => {
    if (props.value.type === 'password') {
      return isPasswordVisible.value ? 'text' : 'password'
    }

    return props.value.type
  })

  const togglePassword = (): void => {
    isPasswordVisible.value = !isPasswordVisible.value
  }

  const clearInputValue = (): void => {
    value.value = null
  }

  const Component = computed(() => {
    const {
      autofocus,
      type,
      isLoading,
      isDisabled,
      isReadonly,
      spellcheck,
      textareaHeight,
    } = props.value

    return h(component.value, {
      spellcheck,
      type: inputType.value,
      disabled: isLoading || isDisabled,
      readonly: isReadonly,
      class: [
        'bg-transparent',
        {
          'cursor-not-allowed': isLoading || isDisabled,
          'cursor-default': isReadonly,
        },
      ],
      style: {
        height: type === 'textarea' ? textareaHeight : undefined,
      },
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
        if (autofocus) {
          setTimeout(() => {
            e.el?.focus()
          }, 0)
        }
      },
    })
  })

  return {
    Component,
    togglePassword,
    clearInputValue,
    state: computed(() => ({
      isPasswordVisible: isPasswordVisible.value,
      isFocused: isFocused.value,
      isDisabled: props.value.isDisabled,
      isLoading: props.value.isLoading,
      isReadonly: props.value.isReadonly,
      type: props.value.type,
    })),
  }
}
