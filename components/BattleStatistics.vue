<template>
  <modal-dialog title="Battle Stats" :actions="actions" @close="$emit('close')">
    <div v-if="statistics.numberOfGamesPlayed > 0">
      <p>Games played {{ statistics.numberOfGamesPlayed }}</p>
      <p>{{ player1Name }} won {{ statistics.player1Won }}</p>
      <p>{{ opponentName }} won {{ statistics.player2Won }}</p>
    </div>
    <div v-else>
      <p>You've never played {{ opponentName }} before.</p>
    </div>
  </modal-dialog>
</template>

<script>

import { getBattleStatistics } from '../scripts/services/gameService'
import { useUserStore } from '../store/userStore'

export default {
  name: 'BattleStatistics',
  props: {
    opponentName: {
      type: String,
      default: '',
      require: true
    },
    opponentId: {
      type: String,
      default: '',
      require: true
    }
  },
  emits: ['close'],
  setup () {
    const store = useUserStore()

    return {
      userId: store.user.uid,
      player1Name: store.playerName
    }
  },
  data () {
    const vm = this
    return {
      statistics: {
        numberOfGamesPlayed: 0,
        player1Won: 0,
        player2Won: 0
      },
      actions: [
        {
          id: 1,
          isSecondary: false,
          title: 'Close',
          handler: () => {
            vm.$emit('close')
          }
        }
      ]
    }
  },
  mounted () {
    // Grab the gameData where the current player and the oppoenent competed
    const vm = this
    getBattleStatistics(this.uid, this.opponentId).then((stats) => {
      if (stats) {
        vm.statistics = stats
      }
    })
  }
}
</script>
