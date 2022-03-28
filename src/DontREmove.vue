<script setup lang="ts">
import {
  onMounted,
  ref,
} from 'vue'

const text = ref()

onMounted(() => {
  // setTimeout(() => {
  //   // document.selection.createRange().parentElement();
  //   const element = document.getSelection()?.focusNode?.parentElement

  //   if (!element) {
  //     return
  //   }

  //   console.log(window.getComputedStyle(element).fontFamily)
  // }, 1000)

  const allElements = document.querySelectorAll('*:not(html,head,script,meta,style,title,link)')

  const colorMap = new Map();

  [ ...allElements ].forEach((element) => {
    const {
      color,
      backgroundColor,
      borderColor,
      fill,
      backgroundImage,
    } = getComputedStyle(element)

    console.log({
      element,
      color,
      backgroundColor,
      borderColor,
      fill,
      backgroundImage,
    })
  })
})
</script>

<template>
  <div>
    <div
      id="deze"
      ref="text"
      :style="{
        'background-image': 'radial-gradient(circle farthest-corner at 100% 0,#ffaccf 28%,#5cb6f8 51%,#ba75e0 87%,#dd5183 96%)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent'
      }"
      class="bg-red-500"
    >
      text hehehe
    </div>

    <div class="bg-green-200" />
  </div>
</template>
