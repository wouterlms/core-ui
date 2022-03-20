<script setup lang="ts">
import {
  computed,
  ref,
  toRef,
  watch,
} from 'vue'

import {
  useIsMobileDevice,
  useVModel,
} from '@wouterlms/composables'

import { useStylingAttributes } from '@/composables'

import { Svg } from '@/utils'

import Dropdown from '../dropdown/Dropdown.vue'
import Input from '../input/Input.vue'
import InputProvider from '../input/InputProvider.vue'
import SelectProvider from './SelectProvider.vue'
import Scrollable from '../scrollable/Scrollable.vue'

interface Props {
  /**
   * @model
   */
  modelValue: unknown,

  /**
   * @model
   */
  filter?: string | null,

  /**
   * Filter placeholder
   */
  filterPlaceholder?: string

  /**
   * Property value which will be displayed
   * Required when `modelValue` is an object
   */
  label?: string

  /**
   * Whether to close the dropdown when an option is (de)selected
   * Defaults to `true`
   */
  closeOnSelect?: boolean

  /**
   * Whether to immediately show the dropdown when the input is focused
   * Defaults: to `true`
   */
  showOnFocus?: boolean

  /**
   * Customize display value
   */
  displayValueTransformer?: (value: unknown | null) => string | null
}

const props = withDefaults(defineProps<Props>(), {
  filter: undefined,
  filterPlaceholder: undefined,
  closeOnSelect: true,
  showOnFocus: true,
  label: undefined,
  displayValueTransformer: undefined,
})

const value = useVModel(toRef(props, 'modelValue'))
const filterValue = useVModel(toRef(props, 'filter'), 'filter')

const optionsEl = ref<InstanceType<typeof Scrollable>>()
const nativeSelectEl = ref<HTMLElement | null>(null)
const isDropdownVisible = ref(false)

const isFilterable = computed(() => props.filter !== undefined)

const isMobileDevice = useIsMobileDevice()
const { nonStylingAttrs } = useStylingAttributes()

const handleOptionToggled = () => {
  if (props.closeOnSelect) {
    isDropdownVisible.value = false
  }
}

const handleFocus = () => {
  if (props.showOnFocus) {
    isDropdownVisible.value = true
  }
}

const getDisplayValue = (multiple: boolean): string | null => {
  if (props.displayValueTransformer) {
    return props.displayValueTransformer(value.value)
  }

  if (multiple) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (props.modelValue as any[]).map((selectedOption) => (
      props.label ? selectedOption[props.label] : selectedOption
    )).join(', ')
  }
  if (!props.modelValue) {
    return null
  }

  if (props.label) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (props.modelValue as any)[props.label]
  }

  return props.modelValue as string
}

watch(isDropdownVisible, (show) => {
  if (!show) {
    filterValue.value = null
  }

  if (show && isMobileDevice) {
    const event = new MouseEvent('mousedown')
    nativeSelectEl.value?.dispatchEvent(event)
  }
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <SelectProvider
    v-slot="{ multiple }"
    v-model="value"
    :is-dropdown-visible="isDropdownVisible"
    :options-el="optionsEl?.$el || null"
    @option-selected="handleOptionToggled"
    @option-deselected="handleOptionToggled"
  >
    <Dropdown
      v-bind="$attrs"
      v-model:show="isDropdownVisible"
      :inherit-width="true"
      :show-arrow="false"
      margin="0.3em"
      class="w-full"
    >
      <slot
        name="input"
        :is-dropdown-visible="isDropdownVisible"
        :multiple="multiple"
        :is-filterable="isFilterable"
        :attrs="$attrs"
      >
        <Input
          v-bind="$attrs"
          :model-value="getDisplayValue(multiple)"
          :is-readonly="true"
          :icon-right="Svg.CHEVRON_UP_CHEVRON_DOWN"
          :class="{
            '!border-accent-primary': !$attrs.error && isDropdownVisible
          }"
          icon-size="0.6em"
          @focus="handleFocus"
          @keydown.space.prevent="isDropdownVisible = true"
          @mousedown="isDropdownVisible = !isDropdownVisible"
        >
          <template #left>
            <slot name="left" />
          </template>
        </Input>
      </slot>

      <select
        v-if="isMobileDevice"
        ref="nativeSelectEl"
        v-model="value"
        :multiple="multiple"
        class="absolute block h-full top-0 w-full z-[-1]"
      >
        <slot />
      </select>

      <template
        v-if="!isMobileDevice"
        #dropdown
      >
        <div v-if="isFilterable">
          <InputProvider
            v-slot="{ Component }"
            v-model="filterValue"
            :placeholder="filterPlaceholder"
            :autofocus="true"
            :tabindex="-1"
          >
            <Component
              :is="Component"
              class="border-none input p-2.5 text-input w-full"
            />
          </InputProvider>
        </div>

        <Scrollable
          v-bind="nonStylingAttrs"
          ref="optionsEl"
          class="flex flex-col max-h-[18em]"
        >
          <slot />
        </Scrollable>
      </template>
    </Dropdown>
  </SelectProvider>
</template>

<style scoped lang="scss">
.input {
  :deep &::placeholder {
    @apply text-sm text-input-placeholder font-light;
  }
}
</style>
