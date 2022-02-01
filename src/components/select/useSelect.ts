import {
  ComputedRef,
  InjectionKey,
  Ref,
  inject,
} from 'vue'

interface Provide {
  selected: Readonly<Ref<unknown>>
  selectOption: (option: unknown) => void
  registerOption: (option: { option: unknown, isDisabled: ComputedRef<boolean> }) => void
  unregisterOption: (option: unknown) => void
  activeDescendantOption: ComputedRef<{ option: unknown, isDisabled: ComputedRef<boolean> }>
}

export const key: InjectionKey<Provide> = Symbol('select')

export const useSelect = () => {
  const data = inject(key)

  if (!data) {
    throw new Error('`select` was not provided')
  }

  return {
    ...data,
  }
}
