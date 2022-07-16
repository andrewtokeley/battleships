<template>
  <modal-dialog v-if="showModal" :actions="actions" @close="$emit('close')">
    <p>What name do you want to use when you're in battle?</p>
    <base-text-input v-model.trim="name" :options="{ placeholder: 'Name' , maximumLength: 10}" />
  </modal-dialog>
</template>

<script>
import { PlayerData } from '../scripts/dataEntities/playerData'
import { addOrUpdatePlayerData } from '../scripts/services/playerService'
import { useUserStore } from '../store/userStore'
import ModalDialog from './ModalDialog.vue'
import BaseTextInput from './BaseTextInput.vue'

export default {
  components: { ModalDialog, BaseTextInput },
  setup () {
    const store = useUserStore()
    return {
      store
    }
  },
  data () {
    const vm = this
    return {
      name: '',
      actions: [
        {
          id: 0,
          title: 'OK',
          handler: () => {
            addOrUpdatePlayerData(new PlayerData(this.store.user.uid), vm.name)
            vm.$emit('close')
          }
        },
        {
          id: 1,
          title: 'Close',
          handler: () => {
            vm.$emit('close')
          }
        }

      ]
    }
  }
}
</script>
