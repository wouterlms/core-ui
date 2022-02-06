<script setup lang="ts">
import { useIsMobileDevice } from '@wouterlms/composables'

import { useTheme } from '@/composables'
import { Svg } from '@/utils'

import Icon from '../icon/Icon.vue'
import SelectOptionProvider from './SelectOptionProvider.vue'

interface Props {
  value: unknown
}

withDefaults(defineProps<Props>(), {})

const { colors } = useTheme()
const isMobileDevice = useIsMobileDevice()
</script>

<template>
  <option
    v-if="isMobileDevice"
    :value="value"
  >
    <slot />
  </option>

  <SelectOptionProvider
    v-else
    v-slot="{ isActiveDescendant, isDisabled, isSelected, multiple }"
    :value="value"
  >
    <div
      :class="[
        isDisabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer',
        {
          'font-medium': isSelected,
          'hover:bg-secondary': !isDisabled && !isSelected,
          'bg-gray-primary': isActiveDescendant,
        },
      ]"
      class="flex items-center justify-between p-4 text-left text-secondary"
    >
      <slot />

      <Transition
        v-if="multiple"
        name="tick-transition"
      >
        <div v-if="isSelected">
          <Icon
            :icon="Svg.TICK"
            :style="{
              color: colors.textColor.tertiary
            }"
            class="w-3"
          />
        </div>
      </Transition>
    </div>
  </SelectOptionProvider>
</template>

<style scoped lang="scss">
.tick-transition {
  &-enter-active,
  &-leave-active {
    transition: 0.2s cubic-bezier(0.22, 0.68, 0, 1.51);
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(50%);
  }
}
</style>
