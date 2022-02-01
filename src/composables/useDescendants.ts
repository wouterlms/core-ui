/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComputedRef,
  Ref,
  computed,
  ref,
  watch,
} from 'vue'
import useEventListener from './useEventListener'

interface Options {
  disabled?: ComputedRef<boolean>,
  defaultIndex?: number
}

interface Option {
  option: any
  isDisabled: ComputedRef<boolean>
  isRendered: boolean
}

enum Direction {
  UP,
  DOWN
}

export default (
  options: Ref<Option[]>,
  optionsEl: ComputedRef<HTMLElement | null>,
  params: Options = {
    disabled: computed(() => false),
    defaultIndex: -1,
  }
) => {
  const { disabled, defaultIndex } = params

  const renderedOptions = computed(() => options.value.filter((o) => o.isRendered))
  const activeDescendantIndex = ref(defaultIndex as number)
  const activeDescendantOption = computed(
    () => renderedOptions.value[activeDescendantIndex.value] || null
  )

  if (disabled) {
    watch(disabled, (isDisabled) => {
      if (isDisabled) {
        activeDescendantIndex.value = defaultIndex as number
      }
    })
  }

  const findNextAvailableOption = (direction: Direction) => {
    const hasAvailableOptions = renderedOptions.value.some(
      (option) => !option.isDisabled.value
    )

    if (!hasAvailableOptions) {
      return
    }

    if (direction === Direction.UP) {
      if (activeDescendantIndex.value > 0) {
        activeDescendantIndex.value -= 1
      } else {
        activeDescendantIndex.value = renderedOptions.value.length - 1
      }
    } else if (direction === Direction.DOWN) {
      if (activeDescendantIndex.value < renderedOptions.value.length - 1) {
        activeDescendantIndex.value += 1
      } else {
        activeDescendantIndex.value = 0
      }
    }

    if (activeDescendantOption.value.isDisabled) {
      findNextAvailableOption(direction)
    }
  }

  const isOptionVisible = (option: HTMLElement) => {
    const container = optionsEl.value

    if (!container) {
      return true
    }

    return (
      option.offsetTop > container.scrollTop
      && option.offsetTop + option.clientHeight <= container.scrollTop + container.clientHeight
    )
  }

  watch((activeDescendantIndex), (index) => {
    if (!optionsEl.value) {
      return
    }

    const optionEl = optionsEl.value.querySelectorAll('button')[index] as HTMLElement

    if (optionEl && !isOptionVisible(optionEl)) {
      optionsEl.value.scrollTo(0, optionEl.offsetTop - optionsEl.value.offsetTop)
    }
  })

  useEventListener('keydown', (e: KeyboardEvent) => {
    if (disabled?.value) {
      return
    }

    // eslint-disable-next-line default-case
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        findNextAvailableOption(Direction.DOWN)
        break

      case 'ArrowUp':
        e.preventDefault()
        findNextAvailableOption(Direction.UP)
        break
    }
  })

  return {
    activeDescendantIndex,
    activeDescendantOption,
  }
}
