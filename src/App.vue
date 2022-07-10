<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from './components'
import { ButtonVariant } from './enums'

import {
  createTheme,
  colors,
  Svg,
} from './theme'

createTheme({
  enableDarkMode: true,
  colors: {
    accent: {
      test: '#ff00ff',
    },
  },
  icons: {},
})

const v = ref(null)

const handleFocus = () => {
  console.log('a')
}
</script>

<template>
  <div class="p-8">
    <Button
      :variant="ButtonVariant.OUTLINE"
      :icon-left="Svg.CORE_WIFI_WARNING"
      :accent-color="colors.accent.red"
    >
      Check connection
    </Button>

    <div>---------</div>

    <Input
      v-model="v"
      :icon-right="Svg.CORE_WIFI_WARNING"
      :is-disabled="false"
      :is-loading="false"
      placeholder="Placeholder"
      class="mt-12 text-xs"
      @focus="handleFocus"
    />
  </div>
</template>
