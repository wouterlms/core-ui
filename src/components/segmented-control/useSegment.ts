import {
  computed,
  h,
  onBeforeUnmount,
  inject,
  useAttrs,
} from 'vue'

import { useIsKeyboardMode } from '@/composables'
import segmentInjectionSymbol from './segmentInjectionSymbol'

export interface Props {
  /**
   * Segment value
   */
  segment: unknown
}

export default () => {
  const props = useAttrs() as unknown as Props

  const {
    selectedSegment,
    selectSegment,
    registerSegment,
    unregisterSegment,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = inject(segmentInjectionSymbol)!

  const isKeyboardMode = useIsKeyboardMode()

  registerSegment(props.segment)

  onBeforeUnmount(() => {
    unregisterSegment(props.segment)
  })

  const isSelected = computed(
    () => selectedSegment.value !== null
      && JSON.stringify(selectedSegment.value) === JSON.stringify(props.segment),
  )

  const Component = computed(() => h('button', {
    type: 'button',
    class: {
      'focus:ring': isKeyboardMode.value,
    },
    onClick: () => selectSegment(props.segment),
  }))

  return {
    Component,
    state: computed(() => ({
      isSelected: isSelected.value,
    })),
  }
}
