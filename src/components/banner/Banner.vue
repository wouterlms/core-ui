<script setup lang="ts">
import {
  defineEmits,
  defineProps,
  h,
  withDefaults,
} from 'vue'

import { Svg } from '@/utils'
import { colors } from '@/utils-v2'

import Button from '../button/Button.vue'
import Icon from '../icon/Icon.vue'

export interface Props {
  accentColor?: string
  title: string
  isClosable?: boolean
}

withDefaults(defineProps<Props>(), {
  accentColor: colors.value.accent.success,
  isClosable: true,
})

const emit = defineEmits<{(event: 'dismiss'): void }>()

const actionButton = h(Button, {
  variant: 'outline',
  colorScheme: 'text-secondary',
  padding: '0.8em 1em',
})
</script>

<template>
  <aside
    :style="{
      backgroundColor: `${accentColor}20`,
      borderColor: accentColor,
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
          color: accentColor
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
