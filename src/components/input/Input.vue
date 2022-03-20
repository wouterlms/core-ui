<script setup lang="ts">
import {
  useBorderRadius,
  useStylingAttributes,
  useTheme,
} from '@/composables'

import { BorderRadius } from '@/types'
import { Svg } from '@/utils'

import Button from '../button/Button.vue'
import Icon from '../icon/Icon.vue'
import InputLabel from './InputLabel.vue'
import InputProvider from './InputProvider.vue'
import Loader from '../loader/Loader.vue'

interface Props {
  modelValue: string | number | null
  error?: boolean
  iconLeft?: Svg
  iconRight?: Svg
  iconSize?: string

  padding?: string,
  rounded?: BorderRadius
}

withDefaults(defineProps<Props>(), {
  error: false,
  iconLeft: undefined,
  iconRight: undefined,
  iconSize: '0.9375em',
  padding: '0.5em',
  rounded: 'default',
})

const { stylingAttrs, nonStylingAttrs } = useStylingAttributes()
const { colors } = useTheme()

const getIconColor = (error: boolean) => (
  error
    ? 'text-error'
    : 'text-tertiary'
)
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <InputProvider
    v-slot="{
      Component,
      props: providedProps,
      isFocused,
      isPasswordVisible,
      togglePassword
    }"
    v-bind="nonStylingAttrs"
    :model-value="modelValue"
  >
    <InputLabel
      v-slot="{ color }"
      v-bind="stylingAttrs"
      :error="!!error"
      :is-disabled="providedProps.isDisabled"
      :is-focused="isFocused"
      :style="{
        borderRadius: useBorderRadius()
      }"
    >
      <slot name="left">
        <Icon
          v-if="iconLeft"
          :icon="iconLeft"
          :class="[getIconColor(error)]"
          :style="{
            width: iconSize,
            height: iconSize,
          }"
          class="flex-shrink-0 ml-[0.625em]"
        />
      </slot>

      <Component
        :is="Component"
        :style="{
          padding,
        }"
        class="w-full"
      />

      <slot name="right">
        <Loader
          v-if="providedProps.isLoading"
          :accent-color="colors.textColor.input"
          class="mr-[0.5em] text-[0.875em]"
        />

        <Icon
          v-else-if="iconRight"
          :icon="iconRight"
          :class="[getIconColor(error)]"
          :style="{
            width: iconSize,
            height: iconSize,
          }"
          class="flex-shrink-0 mr-[0.625em]"
        />

        <Button
          v-else-if="providedProps.type === 'password'"
          :icon-left="isPasswordVisible ? Svg.EYE_HIDE : Svg.EYE_VIEW"
          :is-disabled="providedProps.isDisabled || providedProps.isReadonly"
          :color-scheme="color"
          variant="ghost"
          rounded="sm"
          padding="0.2em"
          class="mr-[0.5em]"
          @click="togglePassword"
        />
      </slot>
    </InputLabel>
  </InputProvider>
</template>

<style scoped lang="scss">
:deep input,
:deep textarea {
  &::placeholder {
    @apply text-[0.875em] text-input-placeholder font-light;
  }
}
</style>
