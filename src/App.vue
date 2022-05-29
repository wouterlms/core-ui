<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Toasts } from '@/components'

const toasts = ref<InstanceType<typeof Toasts>>()

onMounted(() => {
  toasts.value?.createToast({
    title: 'Hello',
    message: 'World',
    type: 'success',
    timeout: 5000,
  })

  setTimeout(() => {
    toasts.value?.createToast({
      title: 'Hello',
      message: 'World',
      type: 'error',
      timeout: 5000,
    })
  }, 1000)
})
</script>

<template>
  <div>
    <Toasts ref="toasts" />
  </div>
</template>
