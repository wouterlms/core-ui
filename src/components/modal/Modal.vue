<script setup lang="ts">
import { defineProps, toRef, withDefaults } from 'vue'

import { useVModel } from '@wouterlms/composables'

import {
  useBorderRadius,
  useStylingAttributes,
} from '@/composables'

import { Svg } from '@/utils'

import { BorderRadius } from '@/types'

import ModalProvider from './ModalProvider.vue'
import Focusable from '../focusable/Focusable.vue'
import Icon from '../icon/Icon.vue'

export interface Props {
  show: boolean
  title?: string
  showCloseButton?: boolean
  blur?: boolean
  padding?: string

  rounded?: BorderRadius
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  showCloseButton: true,
  blur: false,
  padding: '0em',

  rounded: 'default',
})

const showModal = useVModel(toRef(props, 'show'), 'show')

const { stylingAttrs, nonStylingAttrs } = useStylingAttributes()
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <ModalProvider
    v-slot="{ Overlay, isVisible, close }"
    v-model:show="showModal"
    v-bind="nonStylingAttrs"
  >
    <Transition name="modal-transition">
      <div
        v-if="isVisible"
        v-bind="stylingAttrs"
        :style="{
          borderRadius: useBorderRadius()
        }"
        class="-translate-x-1/2 -translate-y-1/2 bg-secondary fixed left-1/2 top-1/2 z-20"
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
    </Transition>

    <Transition name="overlay-transition">
      <Component
        :is="Overlay"
        v-if="isVisible"
        :class="{
          'backdrop-filter backdrop-blur-sm': blur
        }"
        class="z-10"
        @click="close"
      />
    </Transition>
  </ModalProvider>
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
