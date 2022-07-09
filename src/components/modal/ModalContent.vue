<script setup lang="ts">

</script>

<template>
  <div class="w-full">
    <slot />
  </div>

  <div class="flex flex-col gap-y-2 mt-8 w-full">
    <slot name="actions" />
  </div>
</template>
