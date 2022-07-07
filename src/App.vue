<script setup lang="ts">
import {
  Modal, ModalAction, ModalContent, ModalTitle,
} from '@/components'
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <button
    type="button"
    @click="show = true"
  >
    click
  </button>

  <div>
    <Modal
      v-model:show="show"
      padding="1rem"
      title="Airpods Pro van Wouter"
      class="h-1 min-h-[50vh] p-16 pb-8 w-[30rem]"
    >
      <ModalContent>
        <ModalTitle class="text-center">
          iPad-analyse
        </ModalTitle>

        <div class="text-center text-secondary text-sm">
          Om Apple te helpen bij hetverbeteren van zijn producten en diensten, versturen pre-release
          versies van iOS automatisch dianose- en gebruikersinfo. Je kunt dit wijzigen in
          'Privacy' in instellingen. De diagnose-info kan je locatie bevatten.
        </div>

        <template #actions>
          <ModalAction :is-secondary-action="true">
            info over apparaatanalyse en privacy
          </ModalAction>

          <ModalAction>
            Ga door
          </ModalAction>
        </template>
      </ModalContent>
    </Modal>
  </div>
</template>
