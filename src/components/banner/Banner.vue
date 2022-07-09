<script setup lang="ts">
import {
  computed,
  defineEmits,
  defineProps,
  h,
  withDefaults,
} from 'vue'

import { Svg, colors } from '@/theme'

import Button from '../button/Button.vue'
import Icon from '../icon/Icon.vue'

export interface Props {
  accentColor?: string
  title: string
  isClosable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: undefined,
  isClosable: true,
})

const emit = defineEmits<{(event: 'dismiss'): void }>()

const computedAccentColor = computed(
  () => props.accentColor ?? colors.value.accent.primary
)

const actionButton = h(Button, {
  variant: 'outline',
  colorScheme: 'text-secondary',
  padding: '0.8em 1em',
})
</script>

<template>
  <aside
    :style="{
      backgroundColor: `${computedAccentColor}20`,
      borderColor: computedAccentColor,
    }"
    class="bg-opacity-50 border border-solid p-4 pr-8 relative rounded"
  >
    <Button
      v-if="isClosable"
      :icon-left="Svg.CORE_CLOSE_BOLD"
      variant="unstyled"
      icon-size="0.8em"
      padding="0.5em"
      class="!absolute right-3 top-[1.1em]"
      @click="emit('dismiss')"
    />

    <div class="flex">
      <Icon
        :icon="Svg.CORE_INFO_FILLED"
        :style="{
          color: computedAccentColor
        }"
        class="flex-shrink-0 h-5 translate-y-[1px] w-5"
      />

      <div class="ml-4 text-secondary">
        <div class="font-medium pr-4">
          {{ title }}
        </div>

        <div class="mt-1 text-sm">
          <slot />
        </div>

        <div
          v-if="$slots.action"
          class="mt-4"
        >
          <slot
            name="action"
            :ActionButton="actionButton"
          />
        </div>
      </div>
    </div>
  </aside>
</template>
