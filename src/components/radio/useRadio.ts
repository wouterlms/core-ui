import {
  computed,
  h,
  ref,
  toRef,
  useAttrs,
} from 'vue'

import { usePropsWithDefaults } from '@/composables'
import { useVModel } from '@wouterlms/composables'

export interface Props {
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

const defaultProps = {
  isDisabled: false,
  isReadonly: false,
  rounded: 'sm',
}

export default () => {
  const props = usePropsWithDefaults(defaultProps, useAttrs() as unknown as Props)

  const radioValue = useVModel(toRef(props.value, 'modelValue'))
  const isFocused = ref(false)
  const isChecked = computed(() => (
    JSON.stringify(radioValue.value) === JSON.stringify(props.value.value)
  ))

  const select = (): void => {
    if (!props.value.isReadonly) {
      radioValue.value = props.value.value
    }
  }

  const Component = computed(() => {
    const {
      isDisabled,
      isReadonly,
    } = props.value

    return h('button', {
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
        },
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
    })
  })

  return {
    Component,
    state: computed(() => ({
      isChecked: isChecked.value,
      isFocused: isFocused.value,
      isDisabled: props.value.isDisabled,
    })),
  }
}
