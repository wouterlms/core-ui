<script setup lang="ts">
import { defineExpose, ref } from 'vue'

import { Toast } from '@/types'

import ToastItem from './ToastItem.vue'

enum Transition {
  TO_RIGHT = 'toast-transition-to-right',
  TO_BOTTOM = 'toast-transition-to-bottom',
}

const toasts = ref<(Toast & { id: number })[]>([])
const id = ref(0)
const transition = ref(Transition.TO_BOTTOM)

const createToast = (toast: Toast) => {
  const newToast = {
    ...toast,
    id: (id.value += 1),
  }

  // transition.value = Transition.TO_BOTTOM

  toasts.value.push(newToast)

  return newToast
}

const removeToast = (toast: Toast & { id: number }) => {
  const toastIndex = toasts.value.findIndex((t) => t.id === toast.id)

  // transition.value = toastIndex === 0 ?
  // Transition.TO_RIGHT : Transition.TO_BOTTOM

  if (toastIndex !== -1) {
    toasts.value.splice(toastIndex, 1)
  }
}

defineExpose({
  createToast,
  removeToast,
})
</script>

<template>
  <div class="bottom-12 fixed right-20 w-96 z-10">
    <TransitionGroup :name="transition">
      <ToastItem
        v-for="toast of toasts"
        :key="toast.id"
        :toast="toast"
        class="mt-2 toast-transition-item"
        @close="removeToast(toast)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.toast-transition-item {
  transition: transform 0.8s cubic-bezier(0.17, 0.67, 0.16, 0.99), 0.3s opacity;
}

.toast-transition-to-right-enter-from,
.toast-transition-to-right-leave-to,
.toast-transition-to-bottom-enter-from,
.toast-transition-to-bottom-leave-to {
  opacity: 0;
}

.toast-transition-to-bottom-enter-from,
.toast-transition-to-right-enter-from {
  transform: translateX(60px);
}

.toast-transition-to-bottom-leave-to {
  transform: translateY(-30px);
}
.toast-transition-to-right-leave-to {
  transform: translateX(400px);
}

.toast-transition-to-bottom-leave-active {
  position: absolute;
  width: 100%;
  z-index: 10 !important;
}
</style>
