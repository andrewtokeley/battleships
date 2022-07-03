<template>
  <div>
    <h1>Join The Game</h1>
    <h2>{{ gameCode }}</h2>
    <div class="form">
      <base-text-input v-model.trim="userName" :options="{ placeholder: 'Your Name' }" />
    </div>
    <div class="button-group">
      <button-link @click.native="handleJoin">
        JOIN
      </button-link>
      <button-link to="/">
        CANCEL
      </button-link>
    </div>
  </div>
</template>

<script>
import BaseTextInput from '../../components/BaseTextInput.vue'
import ButtonLink from '../../components/ButtonLink.vue'
import { addOrUpdatePlayerData, getPlayerData } from '../../scripts/services/playerService'
import { PlayerData } from '../../scripts/dataEntities/playerData'
import { GameData } from '../../scripts/dataEntities/gameData'
import { useUserStore } from '../../store/userStore'
import { addOrUpdateGameData } from '../../scripts/services/gameService'

export default {
  name: 'JoinBattle',
  components: {
    ButtonLink,
    BaseTextInput
  },
  setup () {
    const store = useUserStore()
    return {
      store
    }
  },
  data () {
    return {
      gameCode: '',
      userName: ''
    }
  },
  async mounted () {
    console.log('Mounted Join')
    this.gameCode = this.$route.params.slug

    // find out whether you are logged in with a player name
    const player = await getPlayerData(this.store.user.uid)
    if (player) {
      this.userName = player.name
    }
  },
  methods: {
    /**
     *
     */
    handleJoin () {
      if (this.userName === '') {
        this.userName = 'No Name'
      }
      const player = addOrUpdatePlayerData(new PlayerData({ id: this.store.user.uid, name: this.userName }))
      if (player) {
        const game = addOrUpdateGameData(new GameData({ id: this.gameCode, boardSize: 10, player1: this.store.user.uid }))
        if (game) {
          this.$router.push(`/play/${this.gameCode}`)
        }
      }
    }
  }
}
</script>

<style scoped>

.form {
  margin-top: 100px;
  width: 100%;
  display:flex;
  align-items: center;
  flex-direction: column;
}
.button-group {
  position: fixed;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin-bottom: 80px;
}

</style>
