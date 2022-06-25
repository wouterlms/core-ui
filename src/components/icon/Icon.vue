<script setup lang="ts">
import {
  computed,
  defineProps,
  watch,
  withDefaults,
} from 'vue'

import { useTheme } from '@/composables'
import { svgs } from '@/utils'

export interface Props {
  icon: string
  preserveOriginalColor?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  preserveOriginalColor: false,
})

const { _icons } = useTheme()
const component = 'svg'

const svg = computed(() => ({
  ...svgs,
  ..._icons,
}[props.icon]))

watch(svg, (svgValue) => {
  if (svgValue === undefined) {
    throw new Error(`\`${props.icon}\` could not be found`)
  }
}, { immediate: true })

const removeHexCodes = (path: string) => {
  let pathWithoutHexCodes = path

  const hexColors = path.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/g) || []

  hexColors.forEach((hex) => {
    pathWithoutHexCodes = pathWithoutHexCodes.replace(hex, 'currentColor')
  })

  return pathWithoutHexCodes
}

const viewBox = computed(() => {
  if (svg.value === undefined) {
    return ''
  }

  const wrapper = document.createElement('div')
  wrapper.innerHTML = svg.value

  const viewbox = wrapper.querySelector('svg')?.getAttribute('viewBox')

  return viewbox
})

const paths = computed(() => {
  if (svg.value === undefined) {
    return ''
  }

  const wrapper = document.createElement('div')
  wrapper.innerHTML = svg.value

  const svgContent = Array.from(wrapper.children)
    .map((c) => c.innerHTML)
    .join('')

  if (props.preserveOriginalColor) {
    return svgContent
  }

  const pathWithoutHexCodes = removeHexCodes(svgContent)

  return pathWithoutHexCodes
})
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <Component
    :is="component"
    :viewBox="viewBox"
    class="fill-current"
    preserveAspectRatio="xMinYMin meet"
    width="100%"
    height="100%"
    v-html="paths"
  />
  <!-- eslint-enable -->
</template>
