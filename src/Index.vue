<script setup lang="ts">
import { ref } from 'vue'

import {
  Button,
  Checkbox,
  Drawer,
  FileInputProvider,
  FormLabel,
  Icon,
  Input,
  Loader,
  Modal,
  Option,
  Radio,
  Segment,
  SegmentedControl,
  Select,
  Switch,
} from '@/components'

import { useTheme } from './composables'

import { Svg } from './utils'

const { createTheme } = useTheme()

createTheme({
  enableDarkMode: true,
})

const options = [
  'Option A',
  'Option B',
  'Option C',
  'Option D',
  'Option E',
  'Option F'
]

const segments = [ 'Users', 'Account settings' ]

const checkboxValue = ref([])
const radioValue = ref(null)
const switchValue = ref(true)
const inputValue = ref('wouter.laermans@appwise.be')
const selectValue = ref(null)
const segmentValue = ref(segments[0])
const showModal = ref(false)
const showDrawer = ref(false)

const fileValue = ref([])
</script>

<template>
  <div class="p-8">
    <div class="gap-8 grid grid-cols-4">
      <div>
        <Icon
          :icon="Svg.CORE_INFO"
          class="w-8"
        />
      </div>

      <div>
        <Loader />
      </div>

      <div>
        <Button
          :icon-left="undefined"
          :icon-right="undefined"
          :is-disabled="false"
          :is-loading="false"
          variant="solid"
          color-scheme="accent-primary"
          rounded="default"
        >
          Create new user
        </Button>
      </div>

      <Checkbox
        v-model="checkboxValue"
        :is-disabled="false"
        accent-color="accent-primary"
        value="value"
      >
        Checkbox
      </Checkbox>

      <Radio
        v-model="radioValue"
        :is-disabled="false"
        :error="false"
        accent-color="accent-primary"
        value="value"
      >
        Radio
      </Radio>

      {{ switchValue }}

      <Switch
        v-model="switchValue"
        :is-disabled="false"
        :error="false"
        accent-color="accent-primary"
      >
        Switch
      </Switch>

      <Input
        v-model="inputValue"
        :is-disabled="false"
        :is-loading="false"
        :error="false"
        :icon-left="undefined"
        :icon-right="undefined"
        rounded="default"
      />

      <Select
        v-model="selectValue"
        rounded="sm"
      >
        <Option
          v-for="option of options"
          :key="option"
          :value="option"
        >
          {{ option }}
        </Option>
      </Select>

      <SegmentedControl v-model="segmentValue">
        <Segment
          v-for="segment of segments"
          :key="segment"
          :segment="segment"
        >
          {{ segment }}
        </Segment>
      </SegmentedControl>

      <div>
        <Button @click="showModal = true">
          Show modal
        </Button>
      </div>

      <div>
        <Button @click="showDrawer = true">
          Show drawer
        </Button>
      </div>
    </div>

    <div class="mt-8">
      <FileInputProvider
        v-slot="{ Dropzone, files, isDropzoneHovered, browse, remove }"
        v-model="fileValue"
        :mime-types="['image/png', 'image/jpeg']"
        :limit="3"
      >
        <div class="flex">
          <div
            v-for="file of files"
            :key="file.url"
            @click="remove(file)"
          >
            <img
              :src="file.url"
              class="h-20 object-cover w-20"
            >

            <div v-if="file.error">
              Error!
            </div>
          </div>
        </div>

        <Component
          :is="Dropzone"
          :class="[
            isDropzoneHovered ? 'border-accent-primary': 'border-primary'
          ]"
          class="border border-dashed flex flex-col h-32 items-center justify-center rounded w-56"
        >
          <div class="text-secondary text-sm">
            {{ isDropzoneHovered ? 'Drop it' : 'Drag & drop files' }}
          </div>

          <Button
            variant="ghost"
            padding="0.2em"
            class="hover:underline mt-1 text-sm"
            @click="browse"
          >
            Browse files
          </Button>
        </Component>
      </FileInputProvider>
    </div>

    <div class="mt-8">
      <label class="inline-block p-4 relative w-60">
        <Checkbox
          v-slot="{ isChecked, isFocused }"
          v-model="checkboxValue"
          value="value2"
        >
          Checkbox

          <div
            :class="[
              isChecked || isFocused ? 'border-accent-primary' : 'border-input',
              isFocused ? 'ring' : ''
            ]"
            class="absolute
              bg-primary
              border
              border-solid
              duration-200
              h-full
              left-0
              rounded
              top-0
              w-full
              z-[-1]"
          />
        </Checkbox>
      </label>
    </div>
  </div>

  <Modal
    v-model:show="showModal"
    class="p-6 w-[34rem]"
    title="Share Project"
  >
    <div class="mt-4 text-secondary">
      <FormLabel
        label="Document link"
        error="Invalid url"
      >
        <Input
          :error="true"
          model-value="https://github.com/"
          rounded="sm"
        />
      </FormLabel>

      <FormLabel
        label="Settings"
        class="mt-6"
      >
        <div class="flex justify-between mt-1">
          <div class="text-sm">
            Anyone at Appwise can view and edit
          </div>
          <Switch :model-value="true" />
        </div>
      </FormLabel>

      <div class="flex justify-end mt-12">
        <Button @click="showModal = false">
          Done
        </Button>
      </div>
    </div>
  </Modal>

  <Drawer
    v-model:show="showDrawer"
    title="Invoice #123032"
    inset="0em"
  >
    <div class="flex h-full items-end pb-10 w-full">
      <div class="w-full">
        <Button
          :icon-left="Svg.CORE_FOLDER"
          class="w-full"
        >
          Show invoice
        </Button>

        <div class="flex justify-center mt-2">
          <Button
            variant="ghost"
            class="font-medium underline"
          >
            Download invoice
          </Button>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<style>
body {
  @apply bg-secondary
}
</style>
