<template>
  <modal-dialog title="Change name" :actions="actions" @close="$emit('close')">
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
  emits: ['close', 'nameChanged'],
  setup () {
    const store = useUserStore()
    return {
      store
    }
  },
  data () {
    const vm = this
    return {
      name: this.store.playerName,
      actions: [
        {
          id: 1,
          isSecondary: true,
          title: 'Close',
          handler: () => {
            vm.$emit('close')
          }
        },
        {
          id: 0,
          title: 'OK',
          handler: (action) => {
            action.showSpinner = true
            addOrUpdatePlayerData(new PlayerData({ id: vm.store.user.uid, name: vm.name })).then(() => {
              action.showSpinner = false
              vm.store.playerName = vm.name
              vm.$emit('nameChanged', vm.name)
              vm.$emit('close')
            })
          }
        }
      ]
    }
  }
}
</script>
