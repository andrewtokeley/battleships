<template>
  <div>
    <div class="join-wrapper">
      <div v-if="!isNew" class="input__gameCode">
        <base-text-input v-model.trim="gameCode" :options="{ placeholder: 'Game Code' }" />
      </div>
      <h1 v-else>
        {{ gameCode }}
        <div v-if="isNew" class="copy-icon material-icons" @click="copyJoinUrlToClipboard">
          content_copy
        </div>
      </h1>
      <p v-if="isNew">
        copy & share with a friend to play and
      </p>

      <p>
        enter your battle name
      </p>
      <div class="form">
        <base-text-input v-model.trim="userName" :options="{ placeholder: 'Your Name' }" />
      </div>
    </div>

    <div class="button-group">
      <button-link :disabled="userName.length < 3" :to="`/play/${gameCode}`">
        LET'S GO...
      </button-link>
    </div>
  </div>
</template>

<script>
import BaseTextInput from '../../components/BaseTextInput.vue'
import ButtonLink from '../../components/ButtonLink.vue'
// import { addOrUpdatePlayerData, getPlayerData } from '../../scripts/services/playerService'
import { getPlayerData } from '../../scripts/services/playerService'
// import { PlayerData } from '../../scripts/dataEntities/playerData'
// import { GameData } from '../../scripts/dataEntities/gameData'
import { useUserStore } from '../../store/userStore'
// import { addOrUpdateGameData } from '../../scripts/services/gameService'
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
      userName: '',
      isNew: false
    }
  },
  async mounted () {
    this.gameCode = this.$route.params.slug
    if (this.$route.query.new) {
      this.isNew = true
    }

    // get the user's name if they've been here before
    const player = await getPlayerData(this.store.user.uid)
    if (player) {
      this.userName = player.name
    }
  },
  methods: {
    /**
     *
     */
    // async handleJoin () {
    //   if (this.userName === '') {
    //     this.userName = 'No Name'
    //   }
    //   // Update the player record
    //   const addPlayer = addOrUpdatePlayerData(new PlayerData({ id: this.store.user.uid, name: this.userName }))

    //   // Create a new game or update existing
    //   const addGame = addOrUpdateGameData(new GameData({ id: this.gameCode, boardSize: 10, player1: this.store.user.uid }))

    //   const [addPlayerResult, addGameResult] = await Promise.all([addGame, addPlayer])

    //   if (addPlayerResult && addGameResult) {
    //     this.$router.push(`/play/${this.gameCode}`)
    //   } else {

    //   }
    // },
    copyJoinUrlToClipboard () {
      const url = window.location.origin + window.location.pathname
      copyTextToClipboard(url)
    }
  }
}
</script>

<style scoped>

.form {
  margin-top: 20px;
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
