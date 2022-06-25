<script setup lang="ts">
import {
  computed,
  defineProps,
  ref,
  toRef,
  watch,
  withDefaults,
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

export interface Props {
  /**
   * @model
   */
  modelValue: unknown,

  /**
   * @model
   */
  filter?: string | null,

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
   * Customize display value
   */
  displayValueTransformer?: (value: unknown | null) => string | null
}

const props = withDefaults(defineProps<Props>(), {
  filter: undefined,
  closeOnSelect: true,
  label: undefined,
  displayValueTransformer: undefined,
})

const value = useVModel(toRef(props, 'modelValue'))
const filterValue = useVModel(toRef(props, 'filter'), 'filter')

const optionsEl = ref<InstanceType<typeof Scrollable>>()
const filterInputEl = ref()
const nativeSelectEl = ref<HTMLElement | null>(null)
const isDropdownVisible = ref(false)
const isFilterInputFocused = ref(false)

const isFilterable = computed(() => props.filter !== undefined)

const isMobileDevice = useIsMobileDevice()
const { nonStylingAttrs } = useStylingAttributes()

const handleOptionToggled = () => {
  if (props.closeOnSelect) {
    isDropdownVisible.value = false
  } else if (isFilterable.value) {
    // filterInputEl.value.$el.nextSibling.focus()
  }
}

const handleClick = () => {
  isDropdownVisible.value = !isDropdownVisible.value
}

const getDisplayValue = (multiple: boolean): string | null => {
  if (props.displayValueTransformer !== undefined) {
    return props.displayValueTransformer(value.value)
  }

  if (multiple) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (props.modelValue as any[]).map((selectedOption) => (
      props.label ? selectedOption[props.label] : selectedOption
    )).join(', ')
  }

  if (props.modelValue === null) {
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
    // Timeout is used so that the list doesn't update when closing
    setTimeout(() => {
      filterValue.value = null
    }, 200)
  }

  if (show && isMobileDevice) {
    nativeSelectEl.value?.dispatchEvent(
      new MouseEvent('mousedown')
    )
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
    :has-filter-applied="!!filterValue?.length"
    @option-selected="handleOptionToggled"
    @option-deselected="handleOptionToggled"
  >
    <Dropdown
      v-bind="$attrs"
      v-model:show="isDropdownVisible"
      :inherit-width="true"
      :show-arrow="false"
      :margin="5"
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
          :model-value="isFilterable && isDropdownVisible && !isMobileDevice
            ? null
            : getDisplayValue(multiple)"
          :is-readonly="true"
          :icon-right="Svg.CORE_CHEVRON_UP_CHEVRON_DOWN"
          :class="{
            '!border-accent-primary': !$attrs.error && isDropdownVisible
          }"
          icon-right-size="0.6em"
          @keydown.space.prevent="isDropdownVisible = true"
          @click="handleClick"
        >
          <template #left>
            <slot name="left" />
          </template>

          <template
            v-if="isFilterable && isDropdownVisible && !isMobileDevice"
            #input
          >
            <!-- eslint-disable vuejs-accessibility/no-autofocus -->
            <InputProvider
              ref="filterInputEl"
              v-slot="{ Component }"
              v-model="filterValue"
              :autofocus="true"
              :placeholder="getDisplayValue(multiple) || $attrs.placeholder"
              :tabindex="-1"
            >
              <Component
                :is="Component"
                :class="{
                  'filter-input-placeholder':
                    getDisplayValue(multiple) !== null && !isFilterInputFocused
                }"
                class="border-none filter-input p-[0.5em] px-2 text-input w-full"
                @focus="isFilterInputFocused = true"
                @blur="isFilterInputFocused = false"
              />
            </InputProvider>
            <!-- eslint-enable vuejs-accessibility/no-autofocus -->
          </template>
        </Input>
      </slot>

      <select
        v-if="isMobileDevice"
        ref="nativeSelectEl"
        v-model="value"
        :multiple="multiple"
        class="absolute block h-full opacity-0 top-0 w-full z-[-1]"
      >
        <slot />
      </select>

      <template
        v-if="!isMobileDevice"
        #dropdown
      >
        <slot name="top" />

        <Scrollable
          v-bind="nonStylingAttrs"
          ref="optionsEl"
          class="flex flex-col max-h-[18em]"
        >
          <slot />
        </Scrollable>

        <slot name="bottom" />
      </template>
    </Dropdown>
  </SelectProvider>
</template>

<style scoped lang="scss">
.filter-input {
  :deep &::placeholder {
    @apply text-[1em] duration-200;
  }
}

.filter-input-placeholder {
  :deep &::placeholder {
    @apply text-input;
  }
}
</style>
