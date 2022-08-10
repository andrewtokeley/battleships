<template>
  <div>
    <div class="code-container">
      <div class="codeGroup">
        <template v-for="(char, index) in gameCodeCharacters">
          <div :key="index" class="code">
            {{ char }}
          </div>
        </template>
      </div>
    </div>
    <p>share this battle code with your opponent!</p>

    <div class="button-group">
      <base-button @click.native="handlePlay">
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

export default {
  name: 'NewBattle',
  components: {
    BaseButton
  },
  setup () {
    const store = useUserStore()
    return {
      userId: store.user.uid
    }
  },
  data () {
    return {
      gameCode: ''
    }
  },
  computed: {
    gameCodeCharacters () {
      return [...this.gameCode]
    }
  },
  async mounted () {
    // await addDefaultBattleships(game.id, this.store.user.uid)
    this.gameCode = await uniqueGameCode()
  },
  methods: {
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

.code-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  margin: 10px 0px 10px 0px;
  padding: 10px;
  color: white;
}

.code-container .codeGroup {
  display: flex;
  flex-direction: row;
}

.code-container .code {
  font-size: var(--bs-font-size-large);
  margin-right: 5px;
  border-bottom: 2px;
  border-bottom-style: solid;
  border-bottom-color: white;
}

.code-container p {
  font-size: 20px;
  text-align: center;
}

.button-group {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin-bottom: 80px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-size: var(--bs-font-size-large)
}
</style>
