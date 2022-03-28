<script setup lang="ts">
import { computed } from 'vue'

import { Svg } from '@/utils'

import Icon from '../icon/Icon.vue'

interface Props {
  route?: string
}

const props = withDefaults(defineProps<Props>(), {
  route: undefined,
})

const isNamedRoute = computed(() => !props.route?.startsWith('/'))
</script>

<template>
  <Component
    :is="!!route ? 'RouterLink' : 'div'"
    :to="isNamedRoute ? { name: route } : route"
    :class="[!!route ? 'hover:underline text-secondary' : 'text-tertiary']"
    class="max-w-[12rem] text-sm truncate"
  >
    <slot />
  </Component>

  <Icon
    v-if="route"
    :icon="Svg.CORE_CHEVRON_RIGHT"
    class="h-auto mx-3 text-tertiary w-1"
  />
</template>
