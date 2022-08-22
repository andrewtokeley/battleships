<template>
  <div class="background">
    <div class="title" />
    <div class="code-container">
      <p v-show="ready">
        Code sequence initiated
      </p>
      <p v-show="!ready">
        Initialising...
      </p>
      <code-input v-model="gameCode" :disabled="true" />
      <base-button :style="{visibility: ready ? 'visible' : 'hidden'}" @click.native="handlePlay">
        LET'S GO
      </base-button>
    </div>
  </div>
</template>

<script>

import BaseButton from '../components/BaseButton.vue'
import { useUserStore } from '../store/userStore'
import { uniqueGameCode, addOrUpdateGameData } from '../scripts/services/gameService'
import { GameData } from '../scripts/dataEntities/gameData'
import CodeInput from '../components/CodeInput.vue'

export default {
  name: 'NewBattle',
  components: {
    BaseButton,
    CodeInput
  },
  setup () {
    const store = useUserStore()
    return {
      userId: store.user.uid
    }
  },
  data () {
    return {
      gameCode: '     ',
      ready: false,
      blinkFlag: false
    }
  },
  // computed: {
  //   gameCodeCharacters () {
  //     return [...this.gameCode]
  //   }
  // },
  mounted () {
    // await addDefaultBattleships(game.id, this.store.user.uid)
    const vm = this
    this.setIntervalX(async () => {
      vm.gameCode = await uniqueGameCode()
    }, 100, 20).then(async () => {
      vm.ready = true
      vm.gameCode = await uniqueGameCode()
      vm.gameCode = this.gameCode
    })
  },
  methods: {
    setIntervalX (callback, delay, repetitions) {
      return new Promise(function (resolve, reject) {
        let x = 0
        const intervalID = setInterval(function () {
          callback()

          if (++x === repetitions) {
            resolve()
            clearInterval(intervalID)
          }
        }, delay)
      })
    },

    async handlePlay () {
      // Actually create the game
      const gameData = new GameData({
        id: this.gameCode,
        boardSize: 10,
        ownerId: this.userId
      })
      await addOrUpdateGameData(gameData)

      // redirect to play
      this.$router.push(`/play/${this.gameCode}`)
      // you're joining your own game so add yourself, and new battleships here
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
