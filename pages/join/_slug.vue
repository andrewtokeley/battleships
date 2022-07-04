<template>
  <div>
    <div class="join-wrapper">
      <h1>
        {{ gameCode }}
        <div class="copy-icon material-icons" @click="copyJoinUrlToClipboard">
          content_copy
        </div>
      </h1>
      <p>copy & share with a friend to play</p>
    </div>
    <div class="form">
      <base-text-input v-model.trim="userName" :options="{ borderless: true, placeholder: 'Your Name' }" />
    </div>
    <div class="button-group">
      <button-link :disabled="userName.length < 3" @click.native="handleJoin">
        LET'S GO...
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
import { copyTextToClipboard } from '../../scripts/copyToClipboard'

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
    },
    copyJoinUrlToClipboard () {
      const url = window.location.href
      copyTextToClipboard(url)
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

.join-wrapper {
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.join-wrapper h1 {
  margin-bottom: 0px;
}
.join-wrapper p {
  color: white;
  width: 30%;
  text-align: center;
  font-size: var(--bs-font-size-medium);
}
.join-wrapper .copy-icon {
  color:white;
  position: relative;
  cursor:pointer;
}
</style>
