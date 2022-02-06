<script setup lang="ts">
import { toRef } from 'vue'

import { useVModel } from '@wouterlms/composables'

import {
  useBorderRadius,
  useStylingAttributes,
  useTheme,
} from '@/composables'

import { Svg } from '@/utils'

import ModalProvider from '../modal/ModalProvider.vue'
import Button from '../button/Button.vue'

interface Props {
  show: boolean
  title: string
  width?: string,
}

const props = withDefaults(defineProps<Props>(), {
  width: '30em',
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
    <Transition name="slide-from-right">
      <div
        v-if="isVisible"
        v-bind="stylingAttrs"
        :style="{
          width,
          borderRadius: useBorderRadius(),
        }"
        class="bg-secondary fixed h-screen right-0 top-0 z-20"
      >
        <header class="flex items-center justify-between mb-6 p-8 pb-0">
          <div>
            <h1
              v-if="title"
              class="font-medium text-primary text-xl"
            >
              {{ title }}
            </h1>
          </div>

          <div>
            <Button
              variant="ghost"
              padding="0.2em"
              :color-scheme="getThemeColor('text-secondary')"
              :icon-left="Svg.CLOSE_BOLD"
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

.slide-from-right {
  &-enter-active,
  &-leave-active {
    transition: 0.5s cubic-bezier(0.17, 0.67, 0.16, 0.99);
  }

  &-enter-from,
  &-leave-to {
    transform: translateX(100%);
  }
}
</style>
