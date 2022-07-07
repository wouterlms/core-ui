<script setup lang="ts">
import { defineProps, toRef, withDefaults } from 'vue'

import { useVModel } from '@wouterlms/composables'

import {
  useBorderRadius,
  useStylingAttributes,
} from '@/composables'

import { Svg } from '@/utils'
import { colors } from '@/utils-v2'

import ModalProvider from '../modal/ModalProvider.vue'
import Button from '../button/Button.vue'

export interface Props {
  show: boolean
  title?: string
  width?: string
  inset?: string
  containerPadding?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  width: '27em',
  inset: '0px',
  containerPadding: '2.5rem',
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
    <Transition name="slide-from-right">
      <div
        v-if="isVisible"
        :style="{
          width,
          borderRadius: useBorderRadius(),
          padding: inset,
        }"
        class="!pl-0 fixed h-full right-0 top-0 z-20"
      >
        <div
          v-bind="stylingAttrs"
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
                variant="ghost"
                padding="0.2em"
                :accent-scheme="colors.text.secondary"
                :icon-left="Svg.CORE_CLOSE_BOLD"
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
        :is="Overlay"
        v-if="isVisible"
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
