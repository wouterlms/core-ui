import { inject } from 'vue'

import { Toast } from '@/types'

export default () => {
  const createToast = inject('createToast') as (toast: Toast) => Toast & { id: number }
  const removeToast = inject('removeToast') as (toast: Toast & { id: number }) => void

  return {
    createToast,
    removeToast,
  }
}
