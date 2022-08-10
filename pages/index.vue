<template>
  <div>
    <modal-dialog v-if="showError" title="Yikes!" @close="showError = false">
      {{ getErrorMessage($route.query.error) }}
    </modal-dialog>
    <div class="button-group">
      <BaseButton @click.native="$router.push(`/new`)">
        NEW GAME
      </BaseButton>
      <br>
      <br>
      <br>
      <base-text-input v-model.trim="joinGameId" :options="{ placeholder: 'Game ID' , maximumLength: 5}" />
      <BaseButton @click.native="join">
        JOIN
      </BaseButton>
    </div>
  </div>
</template>

<script>

import { useUserStore } from '../store/userStore'
import { uniqueGameCode } from '../scripts/services/gameService'
import BaseButton from '../components/BaseButton.vue'
import ModalDialog from '../components/ModalDialog.vue'
import { ErrorType } from '../scripts/Types'

export default {
  name: 'IndexPage',
  components: {
    BaseButton,
    ModalDialog
  },
  emits: ['pageTitleChanged'],
  setup () {
    const store = useUserStore()
    return {
      store
    }
  },
  data () {
    return {
      newGameId: '',
      joinGameId: '',
      showError: false
    }
  },
  computed: {
    newGameUrl () {
      return `/play/${this.newGameId}`
    }
  },
  async mounted () {
    // this won't create a new game but generates a new code
    this.newGameId = await uniqueGameCode()
    this.showError = this.$route.query.error
  },
  methods: {
    getErrorMessage (errorCode) {
      const error = ErrorType.fromCode(errorCode)
      if (error) {
        return error.description
      } else {
        return 'Unknown Error'
      }
    },
    join () {
      if (this.joinGameId.length === 5) {
        this.$router.push(`/play/${this.joinGameId}`)
      }
    }
  }
}
</script>

<style scoped>

.button-group {
  position:absolute;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin-bottom: 80px;
}

</style>
