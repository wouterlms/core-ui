<script setup lang="ts">
import {
  computed,
  h,
  ref,
  toRef,
  watch,
} from 'vue'

import { useVModel } from '@/composables'

interface Preview {
  url: string
  file?: File
  error?: boolean
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/ban-types
  modelValue: Object | string | string[] | File | File[] | null
  limit?: number
  maxFileSize?: number
  replace?: boolean
  mimeTypes?: string[]
  validator?: (file: File) => boolean | null
}

const props = withDefaults(defineProps<Props>(), {
  limit: Infinity,
  maxFileSize: Infinity,
  replace: false,
  mimeTypes: () => [],
  validator: () => true,
})

const value = useVModel(toRef(props, 'modelValue'))

const files = ref<File[]>([])
const isDropzoneHovered = ref(false)

const multiple = computed(() => props.modelValue instanceof Array)

const isSupportedmimeType = (file: File) => (
  props.mimeTypes.length ? props.mimeTypes.indexOf(file.type) !== -1 : true
)

const areEqualFiles = (fileA: File, fileB: File) => (
  fileA.name === fileB.name && fileA.lastModified === fileB.lastModified
)

const previews = computed<Preview[]>(() => files.value.map((file) => ({
  file,
  url: URL.createObjectURL(file),
  error: !props.validator(file)
    || !isSupportedmimeType(file)
    || file.size > props.maxFileSize,
})))

const handleFileInput = (results: File[]) => {
  if (results?.length) {
    if (props.replace || !multiple.value) {
      files.value = []
    }

    const resultsArray = [ ...results ]

    if (multiple.value) {
      files.value.push(
        ...resultsArray.slice(0, props.limit - files.value.length)
      )
    } else {
      files.value = [ results[0] ]
    }
  }
}

const browse = () => {
  const input = document.createElement('input')

  input.type = 'file'
  input.accept = props.mimeTypes.join(',')
  input.multiple = multiple.value

  input.addEventListener('change', (e: Event) => {
    const { files: results } = e.target as HTMLInputElement

    if (results) {
      handleFileInput([ ...results ])
    }
  }, { once: true })

  input.click()
}

const handleDropzoneInput = (e: DragEvent) => {
  e.preventDefault()

  const { dataTransfer } = e

  if (dataTransfer?.files) {
    handleFileInput([ ...dataTransfer.files ])
  }

  isDropzoneHovered.value = false
}

// TODO
const removeFile = (file?: Preview) => {
  if (multiple.value) {
    if (!file?.url) {
      throw Error('`file` parameter is required')
    }

    if (!file.error) {
      const valueIndex = (value.value as Array<File | string>).findIndex((v) => (
        v instanceof File
        && areEqualFiles(v, file.file as File)
      ))

      if (valueIndex !== -1) {
        (value.value as Array<File | string>).splice(valueIndex, 1)
      }
    }

    // previews index is the same as files index
    const previewIndex = previews.value.findIndex((preview) => preview.url === file?.url)

    files.value.splice(previewIndex, 1)
  } else {
    value.value = null
    files.value = []
  }
}

const dropzone = computed(() => h('div', {
  onDragover: (e: DragEvent) => {
    e.preventDefault()

    isDropzoneHovered.value = true
  },
  onDragleave: () => {
    isDropzoneHovered.value = false
  },
  onDrop: handleDropzoneInput,
}))

watch(files, () => {
  if (props.replace) {
    value.value = multiple.value ? [] : null
  }

  if (multiple.value) {
    const validFiles = files.value.filter((file) => (
      props.validator(file) && isSupportedmimeType(file) && file.size <= props.maxFileSize
    ))

    const limit = props.limit - (value.value as Array<unknown>).length

    value.value = [ ...value.value as Array<unknown>, ...validFiles.slice(0, limit) ]
  } else {
    const file = files.value[0]

    if (!file) {
      return
    }

    if (props.validator(file) && isSupportedmimeType(file) && file.size <= props.maxFileSize) {
      value.value = file
    }
  }
}, { deep: true })
</script>

<template>
  <slot
    :file="previews[0]"
    :files="previews"
    :is-dropzone-hovered="isDropzoneHovered"
    :browse="browse"
    :remove="removeFile"
    :Dropzone="dropzone"
  />
</template>
