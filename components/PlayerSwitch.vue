<template>
  <div class="player-switch">
    <div class="spacer" />
    <button class="button" :class="{ active: currentPlayer === 1 }" @click="handleSwitch(1)">
      {{ player1Name.toUpperCase() }}
    </button>
    <button v-if="player2Name" class="button" :class="{ active: currentPlayer === 2 }" @click="handleSwitch(2)">
      {{ player2Name.toUpperCase() }}
    </button>
    <div class="spacer" />
  </div>
</template>

<script>
export default {
  name: 'PlayerSwitch',
  props: {
    player1Name: {
      type: String,
      default: 'PLAYER 1'
    },
    player2Name: {
      type: String,
      default: 'PLAYER 2'
    }
  },
  emits: ['change'],
  data () {
    return {
      currentPlayer: 1
    }
  },
  methods: {
    handleSwitch (player) {
      this.currentPlayer = player
      this.$emit('change', this.currentPlayer)
    }
  }

}
</script>
<style scoped>

.player-switch {
  display: grid;
  height: 40px;
  grid-template-columns: 20px 1fr 1fr 20px;
}

.spacer {
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  border-color: var(--bs-lightblue);
}
.button {
  background: var(--bs-lightblue);
  border-style: none;
  color: var(--bs-darkblue);
}

.button.active {
  background: var(--bs-blue);
  color: white;
  border-width: 1px 1px 0px 1px;
  border-style: solid;
  border-color: var(--bs-lightblue);
}
</style>
