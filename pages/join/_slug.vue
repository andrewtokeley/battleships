<template>
  <div class="background">
    <error-display v-if="showError" title="Yikes!" :error="error" @close="showError = false" />
    <div class="title" />
    <div class="code-container">
      <p>
        Enter battle code
      </p>
      <code-input v-model="gameId" :focus-index="canJoin ? -1 : 0" />
      <base-button :style="{visibility: canJoin ? 'visible' : 'hidden'}" @click.native="handleJoin">
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
      return this.gameId.replace(' ', '').length === 5
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
  position: relative;
  width: 90%;
  height: 5%;
  margin-top: 120px;
  margin-left: auto;
  margin-right: auto;
  background-image: url('~@/assets/battleship_title.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.code-container {
  position: absolute;
  bottom:100px;
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

</style>
