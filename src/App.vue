<script setup lang="ts">
import {
  Modal,
  ModalAction,
  ModalContent,
  ModalTitle,
} from '@/components'

import { createTheme } from './utils-v2'

// probleem is dat props niet updaten

createTheme({
  colors: {
    accent: {
      primary: '#ff00ff',
    },
  },
  icons: {},
  enableDarkMode: true,
})
</script>

<template>
  <div>
    <Modal
      :show="true"
      class="p-16"
    >
      <ModalTitle class="text-center">
        iPad-analyse
      </ModalTitle>

      <ModalContent>
        <div class="text-center text-secondary">
          Om Apple te helpen bij het verbeteren van zijn rpoducten en diensten,
          versturen pre-release versies van iOS autlmatisch diagnose- en gebruikersinfo.
          Je kunt dit wijzigen in 'Privacy' in Instellingen.
        </div>

        <template #actions>
          <ModalAction :is-secondary-action="true">
            Info over apparaatanalyse en privacy
          </ModalAction>

          <ModalAction>
            Ga door
          </ModalAction>
        </template>
      </ModalContent>
    </Modal>
  </div>
</template>
