<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
import { RouteLocationRaw } from 'vue-router'

import { Svg } from '@/theme'

import Icon from '../icon/Icon.vue'

export interface Props {
  to?: RouteLocationRaw
}

withDefaults(defineProps<Props>(), {
  to: undefined,
})
</script>

<template>
  <Component
    :is="!!to ? 'RouterLink' : 'div'"
    :to="to"
    :class="[!!to ? 'hover:underline text-secondary' : 'text-tertiary']"
    class="max-w-[12rem] text-sm truncate"
  >
    <slot />
  </Component>

  <Icon
    v-if="to"
    :icon="Svg.CORE_CHEVRON_RIGHT"
    class="h-auto mx-3 text-tertiary w-1"
  />
</template>
