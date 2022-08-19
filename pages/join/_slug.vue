<template>
  <div class="background">
    <error-display v-if="showError" title="Yikes!" :error="error" @close="showError = false" />
    <div class="title" />
    <div class="button-group">
      <div class="code-container">
        <p>
          Enter battle code Commander
        </p>
        <code-input v-model="gameId" />
      </div>
      <base-button :disabled="!canJoin" @click.native="handleJoin">
        JOIN BATTLE
      </base-button>
    </div>
  </div>
</template>

<script>

import BaseButton from '../../components/BaseButton.vue'
import { useUserStore } from '../../store/userStore'
import CodeInput from '../../components/CodeInput.vue'
import { joinGame } from '../../scripts/services/gameService'
import { send } from '../../scripts/services/messageService'
import { MessageData } from '../../scripts/dataEntities/messageData'

export default {
  name: 'NewBattle',
  components: {
    BaseButton,
    CodeInput
  },
  setup () {
    const store = useUserStore()
    return {
      userId: store.user.uid,
      playerName: store.playerName
    }
  },
  data () {
    return {
      gameId: '     ',
      error: null,
      showError: false
    }
  },
  computed: {
    canJoin () {
      return this.gameId.trim().length === 5
    },
    gameIdQS () {
      const code = this.$route.params.slug
      if (code) {
        return code.toUpperCase()
      }
      return '    '
    }
  },
  mounted () {
    // initialise the gameId from the query string if it exists
    this.gameId = this.gameIdQS
  },
  methods: {
    displayError (error) {
      this.showError = true
      this.error = error
    },
    async handleJoin () {
      // check if you can join
      if (this.canJoin) {
        try {
          const gameData = await joinGame(this.gameId, this.userId)
          // let the owner know you joined
          send(new MessageData({
            gameId: this.gameId,
            forUserId: gameData.ownerId,
            messageType: 'joined',
            data: {
              userId: this.userId,
              playerName: this.playerName
            }
          }), { deleteOnReceive: true })

          // redirect to play the game
          this.$router.push(`/play/${this.gameId}`)
        } catch (error) {
          this.displayError(error)
        }
      }
    }
  }
}
</script>

<style scoped>
.background {
  background-image: url('~@/assets/battleship_image.jpg');
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}

.title {
  position: absolute;
  width: 90%;
  height: 5%;
  top: 120px;
  left: 0px;
  right: 0px;
  margin-left: auto;
  margin-right: auto;
  background-image: url('~@/assets/battleship_title.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.code-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: rgba(80, 91, 55, 0.6);
  margin: 10px 0px 10px 0px;
  padding-top: 10px;
  padding-bottom: 30px;
  color: white;
  width: 100%;
}

.code-container .blink {
  color: transparent;
}

.code-container .codeGroup {
  display: flex;
  flex-direction: row;
}

.code-container .code {
  font-size: var(--bs-font-size-large);
  font-family:courier, "courier new", monospace;
  margin-right: 5px;
  border-bottom: 2px;
  border-bottom-style: solid;
  border-bottom-color: white;
}

.code-container p {
  font-weight: var(--bs-font-size-extra-large);
  text-align: center;
}

.button-group {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin-bottom: 100px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-size: var(--bs-font-size-large)
}
</style>
