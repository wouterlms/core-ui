import {
  toRef,
  watch,
  computed,
  h,
  useAttrs,
  Ref,
} from 'vue'

import {
  useEventListener,
  useVModel,
} from '@wouterlms/composables'

import { usePropsWithDefaults } from '@/composables'

import ModalWrapper from './ModalWrapper.vue'

export interface Props {
  /**
   * @modal
   * Show modal
   */
  show: boolean

  /**
    * Close modal when `escape` key is pressed
    */
  closeOnEscape?: boolean

  /**
    * Trap focus
    */
  trapFocus?: boolean
}

const defaultProps = {
  closeOnEscape: true,
  trapFocus: true,
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default () => {
  const props = usePropsWithDefaults(defaultProps, useAttrs() as unknown as Props)

  const showModal = useVModel<boolean>(toRef(useAttrs(), 'show') as Ref<boolean>, 'show')

  const close = (): void => {
    showModal.value = false
  }

  watch(
    showModal,
    (show) => {
      if (show) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    },
    { immediate: true },
  )

  if (props.value.closeOnEscape) {
    useEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === 'Escape' && showModal.value) {
        e.preventDefault()
        showModal.value = false
      }
    })
  }

  const Component = computed(() => h(ModalWrapper, {
    active: showModal.value && props.value.trapFocus,
  }))

  return {
    Component,
    close,
    state: computed(() => ({
      isVisible: showModal.value,
    })),
  }
}
