<template>
  <modal-dialog
    title="Invite a friend"
    :actions="modalActions"
    @close="$emit('close')"
  >
    <p>
      Copy and share link to play with a friend!
    </p>
    <input readonly="readonly" type="text" class="urlInput" :value="shareUrl">
  </modal-dialog>
</template>

<script>
import { copyTextToClipboard } from '../scripts/copyToClipboard'
import ModalDialog from './ModalDialog.vue'

export default {
  components: { ModalDialog },
  props: {
    gameId: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  setup (props) {
    const shareUrl = `${window.location.origin}/join/${props.gameId}`
    return {
      shareUrl
    }
  },
  data () {
    const vm = this
    return {
      modalActions: [
        {
          id: 0,
          title: 'Cancel',
          isSecondary: true,
          handler: () => {
            vm.$emit('close')
          }
        },
        {
          id: 1,
          title: 'Copy',
          confirmationMessage: 'copied',
          handler: () => {
            copyTextToClipboard(vm.shareUrl)
            return true
          }
        }
      ]
    }
  }
}
</script>

<style scoped>

.urlInput {
-webkit-appearance: none;
  height: 30px;
  width: 100%;
  min-width: 300px;
  border-radius: 5px;
  background: var(--bs-extralightgrey);
  cursor: text;
  text-overflow: ellipsis;
  box-sizing: border-box;
  border: 2px transparent solid;
  padding: 15px;
  font-size: var(--bs-font-normal);
}

.urlInput:focus {
  outline: none;
  border: 2px var(--bs-green) solid;
}

.urlInput:hover {
  background: var(--bs-lightgrey);
}
</style>
