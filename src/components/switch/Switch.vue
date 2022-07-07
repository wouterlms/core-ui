<script setup lang="ts">
import {
  defineProps,
  nextTick,
  onMounted,
  ref,
  useSlots,
  withDefaults,
} from 'vue'

import {
  useIsKeyboardMode,
  useStylingAttributes,
} from '@/composables'

import { colors } from '@/utils'

import CheckboxProvider from '../checkbox/CheckboxProvider.vue'

export interface Props {
  modelValue: unknown
  value?: unknown
  accentColor?: string
}

withDefaults(defineProps<Props>(), {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: true as any,
  accentColor: colors.value.accent.primary,
})

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

const { stylingAttrs, nonStylingAttrs } = useStylingAttributes()

const thumbStyle = (isChecked: boolean) => ({
  transition: transition ?? undefined,
  transform: isChecked
    ? `translateX(calc(${switchWidth.value}px - 100% - calc(${padding} * 2)))`
    : undefined,
})
</script>

<template>
  <CheckboxProvider
    v-slot="{ Component, props: providedProps, isChecked }"
    v-bind="nonStylingAttrs"
    :model-value="modelValue"
    :value="value"
  >
    <Component
      v-bind="stylingAttrs"
      :is="slots.default ? 'label' : 'div'"
      class="flex items-center"
    >
      <Component
        :is="Component"
        ref="switchEl"
        :class="[
          {
            'focus:ring': isKeyboardMode,
            'opacity-50': providedProps.isDisabled,
          }
        ]"
        :style="{
          padding,
          backgroundColor: isChecked
            ? colors.accent.primary
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
          :style="thumbStyle(isChecked)"
          class="bg-white h-[1.5em] rounded-full shadow w-[1.5em]"
        />
      </Component>

      <span
        v-if="slots.default"
        :class="{
          'opacity-50': providedProps.isDisabled
        }"
        class="ml-2 text-secondary"
      >
        <slot />
      </span>
    </Component>
  </CheckboxProvider>
</template>
