<script setup lang="ts">
import {
  computed,
  defineProps,
  nextTick,
  onMounted,
  ref,
  useSlots,
  withDefaults,
} from 'vue'

import {
  useIsKeyboardMode,
} from '@/composables'

import { colors } from '@/theme'

import useCheckbox, { Props as BaseProps } from '../checkbox/useCheckbox'

export interface Props extends BaseProps {
  accentColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: true as any,
  accentColor: undefined,
})

const { Component, state } = useCheckbox()

const computedAccentColor = computed(() => (
  props.accentColor ?? colors.value.accent.primary
))

const isKeyboardMode = useIsKeyboardMode()
const slots = useSlots()

const switchEl = ref<HTMLElement | null>(null)
const switchWidth = ref(0)
const padding = '1px'
let transition: string | null = null

onMounted(async () => {
  switchWidth.value = switchEl.value?.clientWidth ?? 0

  // Delay setting the transition to make sure if the initial
  // state is checked, it does not transition
  await nextTick()

  transition = '0.3s cubic-bezier(0.22, 0.68, 0, 1.1)'
})

const thumbStyle = computed(() => ({
  transition: transition ?? undefined,
  transform: state.value.isChecked
    ? `translateX(calc(${switchWidth.value}px - 100% - calc(${padding} * 2)))`
    : undefined,
}))
</script>

<template>
  <Component
    :is="slots.default ? 'label' : 'div'"
    class="flex items-center text-sm"
  >
    <Component
      :is="Component"
      ref="switchEl"
      :class="[
        {
          'focus:ring': isKeyboardMode,
          'opacity-50': state.isDisabled,
        }
      ]"
      :style="{
        padding,
        backgroundColor: state.isChecked
          ? computedAccentColor
          : colors.background.switch,
      }"
      class="border
          border-solid
          border-transparent
          box-content
          duration-200
          min-w-[2.5em]
          rounded-[1rem]"
    >
      <div
        :style="thumbStyle"
        class="bg-white h-[1.5em] rounded-full shadow w-[1.5em]"
      />
    </Component>

    <span
      v-if="slots.default"
      :class="{
        'opacity-50': state.isDisabled
      }"
      class="ml-2 text-secondary"
    >
      <slot />
    </span>
  </Component>
</template>
