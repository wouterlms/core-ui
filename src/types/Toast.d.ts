import { RenderFunction } from 'vue'

export interface Toast {
  id?: number
  title: string
  message?: string | RenderFunction
  timeout?: number
  icon?: string
  type?: 'info' | 'success' | 'error'
  action?: {
    label: string
    cb: () => void
  }
  test?: RenderFunction
}
