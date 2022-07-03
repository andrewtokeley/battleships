<template>
  <div>
    <h1>BATTLESHIPS</h1>
    <span class="close material-icons">
      close
    </span>
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
      <button-link @click="handleJoin">
        PLAY
      </button-link>
    </div>
  </div>
</template>

<script>
import ButtonLink from '../components/ButtonLink.vue'
import { useUserStore } from '../store/userStore'

export default {
  name: 'NewBattle',
  components: {
    ButtonLink
  },
  setup () {
    const store = useUserStore()
    return {
      store
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
  mounted () {
    // await addDefaultBattleships(game.id, this.store.user.uid)
    this.gameCode = 'ADFEW'
  },
  methods: {
    handleJoin () {
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

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-size: var(--bs-font-size-large)
}
</style>
