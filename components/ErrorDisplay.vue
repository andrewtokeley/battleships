<template>
  <modal-dialog title="Yikes!" :actions="actions" @close="$emit('close')">
    {{ error.message }}
  </modal-dialog>
</template>

<script>
import { GameDefaultError } from '../scripts/Types'
// import { ErrorType } from '../scripts/Types'

export default {
  name: 'ErrorDisplay',
  props: {
    error: {
      type: Error,
      default: () => {
        return new GameDefaultError(0, 'Unknown error')
      },
      require: true
    }
  },
  emits: ['close'],
  data () {
    const vm = this
    return {
      actions: [
        {
          id: 1,
          isSecondary: false,
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
