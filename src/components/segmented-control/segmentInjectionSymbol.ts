import { InjectionKey, Ref } from 'vue'

export default Symbol('segmentedControl') as InjectionKey<{
  selectedSegment: Readonly<Ref<unknown | null>>
  selectSegment: (segment: unknown) => void
  registerSegment: (segment: unknown) => void
  unregisterSegment: (segment: unknown) => void
}>
