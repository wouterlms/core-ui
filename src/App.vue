<script setup lang="ts">
import { ref } from 'vue'

import {
  Segment,
  SegmentedControl,
  Modal,
  Button,
  Checkbox,
} from './components'

import { createTheme } from './theme'

const segments = [
  'Segment A',
  'Segment B',
]
const segment = ref(segments[0])

createTheme({
  colors: {},
  icons: {},
  enableDarkMode: true,
})

const showModal = ref(false)

const cbv = ref([])
</script>

<template>
  <div class="p-8">
    <SegmentedControl v-model="segment">
      <Segment
        v-for="s of segments"
        :key="s"
        :segment="s"
      >
        {{ s }}
      </Segment>
    </SegmentedControl>

    <button
      type="button"
      @click="showModal = true"
    >
      show modal
    </button>

    <Modal v-model:show="showModal">
      <div class="p-8">
        modal content

        <Button type="button">
          btn
        </Button>
      </div>
    </Modal>

    <Checkbox
      v-model="cbv"
      value="test"
    />

    {{ cbv }}
  </div>
</template>
