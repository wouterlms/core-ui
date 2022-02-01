import {
  Ref,
  isRef,
} from 'vue'

import useEventListener from './useEventListener'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (binding: Ref<boolean> | ((...args: any) => any)) => {
  useEventListener('keydown', (e: KeyboardEvent) => {
    const { key } = e

    if (key === 'Escape') {
      if (isRef(binding)) {
        binding.value = false
      } else {
        binding()
      }

      e.stopPropagation()
      e.preventDefault()
    }
  })
}
