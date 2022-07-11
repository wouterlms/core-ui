<script setup lang="ts">
import { useComponentAttrs } from '@/composables'
import { ref, watch } from 'vue'

import Dropdown from '../dropdown/Dropdown.vue'
import Input from '../input/Input.vue'

const options = [
  {
    label: 'John',
  },
  {
    label: 'Doe',
  },
  {
    label: 'Test',
  },
]

const {
  listenerAttrs,
  nonStylingAttrs,
  stylingAttrs,
} = useComponentAttrs()

const value = ref<unknown | null>(null)
const showDropdown = ref(false)
const listboxEl = ref<HTMLElement | null>(null)

const isOptionSelected = (option: unknown): boolean => (
  JSON.stringify(option) === JSON.stringify(value.value)
)

watch((showDropdown), (show) => {
  if (show) {
    if (listboxEl.value === null) {
      throw Error('Listbox element is null')
    }

    listboxEl.value.focus()

    // listboxEl.value.addEventListener('keydown', ({ key }: KeyboardEvent) => {
    //   console.log(key)
    //   if (key === 'ArrowDown') {
    //     console.log('arrow down')
    //   }
    // })
    setTimeout(() => {
      console.log(document.activeElement)
    })
  }
})

const handleArrowDown = (): void => {
  console.log('@arrow down')
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <Dropdown
    v-bind="nonStylingAttrs"
    v-model:show="showDropdown"
    :inherit-width="true"
    :show-arrow="false"
    :margin="5"
  >
    <Input
      v-bind="{
        ...listenerAttrs,
        ...stylingAttrs
      }"
      :model-value="null"
      :is-readonly="true"
      @click="showDropdown = true"
      @keydown.space="showDropdown = true"
      @keydown.enter="showDropdown = true"
    />

    {{ value }}

    <template #dropdown>
      <!-- TODO: this should be a custom component -->
      <ul
        ref="listboxEl"
        role="listbox"
        :tabindex="0"
        :aria-activedescendant="undefined"
      >
        <li
          v-for="(option, i) of options"
          :key="i"
          :value="option"
          :aria-selected="isOptionSelected(option)"
          :tabindex="-1"
          role="option"
          @click="value = option"
        >
          {{ option.label }}
        </li>
      </ul>
    </template>
  </Dropdown>
</template>
