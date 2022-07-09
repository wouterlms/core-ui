<script setup lang="ts">
import {
  defineProps,
  withDefaults,
} from 'vue'

import { useBorderRadius } from '@/composables'

import { Svg } from '@/theme'

import { BorderRadius } from '@/types'

import Focusable from '../focusable/Focusable.vue'
import Icon from '../icon/Icon.vue'
import ModalOverlay from './ModalOverlay.vue'
import useModal, { Props as BaseProps } from './useModal'

export interface Props extends BaseProps {
  showCloseButton?: boolean
  blur?: boolean
  rounded?: BorderRadius
}

withDefaults(defineProps<Props>(), {
  showCloseButton: true,
  blur: false,
  rounded: 'default',
})

const {
  Component,
  state,
  close,
} = useModal()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <Component :is="Component">
    <Transition name="modal-transition">
      <!-- <FocusTrap v-if="state.isVisible"> -->
      <div
        v-if="state.isVisible"
        v-bind="$attrs"
        :style="{
          borderRadius: useBorderRadius()
        }"
        class="-translate-x-1/2
        -translate-y-1/2
        bg-secondary
        fixed
        flex
        flex-col
        justify-between
        left-1/2
        top-1/2
        z-20"
      >
        <Focusable
          v-if="showCloseButton"
          class="absolute bg-gray-secondary p-1.5 right-3 rounded-full top-3"
          @click="close"
        >
          <Icon
            :icon="Svg.CORE_CLOSE_BOLD"
            class="h-2 text-secondary w-2"
          />
        </Focusable>

        <slot />
      </div>
      <!-- </FocusTrap> -->
    </Transition>

    <Transition name="overlay-transition">
      <Component
        :is="ModalOverlay"
        v-if="state.isVisible"
        :class="{
          'backdrop-filter backdrop-blur-sm': blur
        }"
        class="z-10"
        @click="close"
      />
    </Transition>
  </Component>
</template>

<style scoped lang="scss">
.overlay-transition {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s cubic-bezier(0.17, 0.67, 0.16, 0.99);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

.modal-transition {
  &-enter-active,
  &-leave-active {
    transition: 0.3s cubic-bezier(0.22, 0.68, 0, 1.51);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.1) !important;
  }
}
</style>
