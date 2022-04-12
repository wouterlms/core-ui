import {
  InjectionKey,
  Ref,
  inject,
} from 'vue'

interface Provide {
  selectedSegment: Readonly<Ref<unknown | null>>
  selectSegment: (segment: unknown) => void
  registerSegment: (segment: unknown) => void
  unregisterSegment: (segment: unknown) => void
}

export const key: InjectionKey<Provide> = Symbol('segment')

export const useSegmentedControl = () => {
  const data = inject(key)

  if (data == null) {
    throw new Error('`select` was not provided')
  }

  return {
    ...data,
  }
}
