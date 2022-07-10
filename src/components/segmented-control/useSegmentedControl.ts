import {
  computed,
  toRef,
  ref,
  onMounted,
  onBeforeUnmount,
  provide,
  readonly,
  StyleValue,
  watch,
  h,
  useAttrs,
} from 'vue'

import { useVModel } from '@wouterlms/composables'

import segmentInjectionSymbol from './segmentInjectionSymbol'

interface SegmentDimensions {
  left: number
  width: number
}

export interface Props {
  /**
   * @model
   */
  modelValue: unknown
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default () => {
  const props = useAttrs() as unknown as Props
  const value = useVModel(toRef(props, 'modelValue'))

  const segments = ref<unknown[]>([])
  const segmentDimensions = ref<SegmentDimensions[]>([])
  const transitionDuration = ref(0)

  let mutationObserver: MutationObserver | null = null

  // as soon as the first value is set, enable the transition
  watch(value, () => {
    transitionDuration.value = 400
  })

  const getEl = (): HTMLElement | null => document.querySelector('.segmented-control') ?? null

  const isSegmentSelected = (segment: unknown): boolean => (
    JSON.stringify(value.value) === JSON.stringify(segment)
  )

  const style = computed<StyleValue>(() => {
    if (segmentDimensions.value.length === 0) {
      return {}
    }

    const segmentIndex = segments.value.findIndex((segment) => isSegmentSelected(segment))

    const { left, width } = segmentDimensions.value[segmentIndex]

    return {
      position: 'absolute',
      bottom: 0,
      left: 0,
      pointerEvents: 'none',
      transform: `translate3d(${left}px, 0, 0)`,
      width: `${width}px`,
      transition: `${transitionDuration.value}ms cubic-bezier(0.8, 0.5, 0.3, 1)`,
    }
  })

  const selectSegment = (segment: unknown): void => {
    value.value = segment
  }

  const setSegmentDimensions = (): void => {
    const segmentedControlEl = getEl()

    if (segmentedControlEl == null) {
      return
    }

    Array.from(segmentedControlEl.querySelectorAll('button')).forEach((tab, i) => {
      segmentDimensions.value[i] = {
        width: tab.clientWidth,
        left: tab.offsetLeft,
      }
    })
  }

  const createMutationObserver = (): void => {
    mutationObserver = new MutationObserver(() => {
      setSegmentDimensions()
    })

    mutationObserver.observe(getEl() as HTMLElement, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }

  const registerSegment = (segment: unknown): void => {
    segments.value.push(segment)
  }

  const unregisterSegment = (segment: unknown): void => {
    const segmentIndex = segments.value.findIndex((s) => (
      JSON.stringify(s) === JSON.stringify(segment)
    ))

    segments.value.splice(segmentIndex, 1)
  }

  onMounted(() => {
    setSegmentDimensions()
    createMutationObserver()
  })

  onBeforeUnmount(() => {
    mutationObserver?.disconnect()
  })

  provide(segmentInjectionSymbol, {
    selectedSegment: readonly(value),
    registerSegment,
    unregisterSegment,
    selectSegment,
  })

  const Component = h('div', {
    class: 'relative segmented-control',
  })

  return {
    Component,
    state: computed(() => ({
      style: style.value,
    })),
  }
}
