import {
  Ref,
  computed,
  isRef,
} from 'vue'

import useInstance from './useInstance'

export default <T>(binding: T | Ref<T>, key = 'modelValue') => {
  const instance = useInstance('useVModel')

  return computed<T>({
    get() {
      return isRef(binding) ? binding.value : binding
    },
    set(value) {
      instance.emit(`update:${key}`, value)
    },
  })
}
