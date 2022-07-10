<script setup lang="ts">
import {
  defineProps,
  withDefaults,
} from 'vue'

import { useBorderRadius } from '@/composables'

import { Svg, colors } from '@/theme'

import { ButtonVariant } from '@/enums'

import Button from '../button/Button.vue'

import ModalOverlay from '../modal/ModalOverlay.vue'
import useModal, { Props as BaseProps } from '../modal/useModal'

export interface Props extends BaseProps {
  /**
   * Drawer title
   */
  title?: string

  /**
   * Drawer width
   */
  width?: string

  /**
   * Drawer outside padding
   */
  inset?: string

  /**
   * Drawer inside padding
   */
  containerPadding?: string
}

withDefaults(defineProps<Props>(), {
  title: undefined,
  width: '27em',
  inset: '0px',
  containerPadding: '2.5rem',
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
    <Transition name="slide-from-right">
      <div
        v-if="state.isVisible"
        :style="{
          width,
          borderRadius: useBorderRadius(),
          padding: inset,
        }"
        class="!pl-0 fixed h-full right-0 top-0 z-20"
      >
        <div
          v-bind="$attrs"
          class="bg-secondary flex flex-col h-full w-full"
        >
          <header class="flex items-center justify-between mb-6 p-10 pb-0">
            <slot name="title">
              <h1
                v-if="title"
                class="font-medium text-lg text-secondary"
              >
                {{ title }}
              </h1>
            </slot>

            <div>
              <Button
                :variant="ButtonVariant.GHOST"
                :accent-scheme="colors.text.secondary"
                :icon-left="Svg.CORE_CLOSE_BOLD"
                padding="0.2em"
                @click="close"
              />
            </div>
          </header>

          <div
            :style="{
              padding: `0 ${containerPadding}`
            }"
            class="h-full overflow-y-auto"
          >
            <slot />
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="overlay-transition">
      <Component
        :is="ModalOverlay"
        v-if="state.isVisible"
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
    transition: opacity 0.4s cubic-bezier(0.17, 0.67, 0.16, 0.99);
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

.slide-from-right {
  &-enter-active,
  &-leave-active {
    transition: 0.4s cubic-bezier(.06,.94,.42,1);
  }

  &-enter-from,
  &-leave-to {
    transform: translateX(100%) /* scale(1.05) */;
  }
}
</style>
