<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import {
  Option,
  SegmentProvider,
  SegmentedControlProvider,
  Select,
} from './components'

import { Svg } from './utils'

const value = ref([ ])
const filter = ref<string | null>(null)
const options = [
  'Option A',
  'Option B',
  'Option C',
  'Yeet'
]

const filteredOptions = computed(() => {
  if (!filter.value?.length) {
    return options
  }

  return options.filter((o) => o.toLocaleLowerCase().includes(filter.value!.toLowerCase()))
})

const segments = [
  'In progress',
  'New assigned',
  'Completed'
]

const segment = ref(segments[0])
</script>

<template>
  <div class="p-8">
    <Select
      v-model="value"
      v-model:filter="filter"
      :icon-left="Svg.CORE_FOLDER"
      :close-on-select="false"
      placeholder="Placeholder"
      rounded="sm"
      class="w-72"
    >
      <Option
        v-for="option of filteredOptions"
        :key="option"
        :value="option"
      >
        {{ option }}
      </Option>
    </Select>

    <div class="mt-24">
      <SegmentedControlProvider
        v-slot="{ style }"
        v-model="segment"
      >
        <SegmentProvider
          v-for="s of segments"
          v-slot="{ Component, isSelected }"
          :key="s"
          :segment="s"
        >
          <Component
            :is="Component"
            :class="[
              isSelected ? 'text-secondary' : 'text-tertiary'
            ]"
            class="duration-200 mr-8 py-3"
          >
            {{ s }}
          </Component>
        </SegmentProvider>

        <div
          :style="{
            ...style,
            width: `calc(${style.width} - 10px)`
          }"
          class="bg-accent-primary bottom-0 h-[3px] rounded-t-md"
        />

        <div class="border border-solid border-tertiary" />
      </SegmentedControlProvider>
    </div>
  </div>
</template>
