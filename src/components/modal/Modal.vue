<script setup lang="ts">
import { toRef } from 'vue'

import { useVModel } from '@wouterlms/composables'

import {
  useBorderRadius,
  useStylingAttributes,
  useTheme,
} from '@/composables'

import { Svg } from '@/utils'

import { BorderRadius } from '@/types'
import ModalProvider from './ModalProvider.vue'
import Button from '../button/Button.vue'

interface Props {
  show: boolean
  title?: string
  showCloseButton?: boolean
  blur?: boolean

  rounded?: BorderRadius
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  showCloseButton: true,
  blur: true,

  rounded: 'default',
})

const showModal = useVModel(toRef(props, 'show'), 'show')

const { stylingAttrs, nonStylingAttrs } = useStylingAttributes()
const { getThemeColor } = useTheme()
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
        <header class="flex items-center justify-between">
          <div>
            <h1
              v-if="title"
              class="font-medium text-lg text-secondary"
            >
              {{ title }}
            </h1>
          </div>

          <div>
            <Button
              v-if="showCloseButton"
              variant="ghost"
              padding="0.2em"
              :color-scheme="getThemeColor('text-secondary')"
              :icon-left="Svg.CORE_CLOSE_BOLD"
              @click="close"
            />
          </div>
        </header>

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
