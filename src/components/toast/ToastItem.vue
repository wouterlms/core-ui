<script setup lang="ts">
import { useTimeout } from '@wouterlms/composables'

import { useTheme } from '@/composables'

import { Toast } from '@/types'
import { Svg } from '@/utils'

import Icon from '../icon/Icon.vue'
import Button from '../button/Button.vue'

interface Props {
  toast: Toast
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{(event: 'close'): void }>()

const { getThemeColor } = useTheme()

if (props.toast.timeout) {
  useTimeout(() => {
    emit('close')
  }, props.toast.timeout)
}

const color = getThemeColor(props.toast.type || '#4447e0')

const handleActionClick = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  props.toast.action!.cb()

  emit('close')
}
</script>

<template>
  <aside
    class="backdrop-blur-sm
      backdrop-filter
      bg-opacity-90
      bg-primary
      overflow-hidden
      p-4
      relative
      rounded-default
      shadow-light
      w-full
      z-20"
  >
    <div
      :style="{
        background: color,
      }"
      class="absolute h-full left-0 top-0 w-[2px]"
    />
    <header class="flex items-center">
      <Icon
        :style="{
          color,
        }"
        :icon="toast.icon || Svg.CORE_INFO"
        class="w-5"
      />

      <h1 class="font-medium pl-6 text-secondary">
        {{ toast.title }}
      </h1>

      <Button
        :icon-left="Svg.CORE_CLOSE_BOLD"
        variant="ghost"
        icon-left-size="8px"
        color-scheme="text-tertiary"
        padding="0.2em"
        class="ml-auto"
        @click="$emit('close')"
      />
    </header>

    <div class="ml-11 mt-2">
      <p
        v-if="typeof toast.message === 'string'"
        class="text-sm text-tertiary"
      >
        {{ toast.message }}
      </p>

      <Component
        :is="toast.message"
        v-else-if="toast.message"
      />
    </div>

    <div
      v-if="toast.action"
      class="ml-11 mt-3"
    >
      <!--
        <UnstyledButton
        class="font-medium hover:underline text-secondary text-xs"
        @click="handleActionClick"
        >
        {{ toast.action.label }}
        </UnstyledButton>
      -->
    </div>

    <Component
      :is="toast.test"
      v-if="toast.test"
    />
  </aside>
</template>
