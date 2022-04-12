<script setup lang="ts">
import {
  defineProps,
  toRef,
  watch,
  withDefaults,
} from 'vue'

import { FocusTrap } from 'focus-trap-vue'

import {
  useEventListener,
  useVModel,
} from '@wouterlms/composables'

import Overlay from './ModalOverlay.vue'

interface Props {
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
   * Enable trap focus, defaults to `true`
   */
  enableTrapFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeOnEscape: true,
  enableTrapFocus: true,
})

const showModal = useVModel(toRef(props, 'show'), 'show')

const close = () => {
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
  { immediate: true }
)

if (props.closeOnEscape) {
  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'Escape' && showModal.value) {
      e.preventDefault()
      showModal.value = false
    }
  })
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <Teleport to="body">
    <FocusTrap :active="enableTrapFocus && showModal">
      <!-- Without the extra div, FocusTrap throws an error -->
      <div class="h-full w-full">
        <slot
          :props="props"
          :close="close"
          :is-visible="showModal"
          :Overlay="Overlay"
        />
      </div>
    </FocusTrap>
  </Teleport>
</template>
