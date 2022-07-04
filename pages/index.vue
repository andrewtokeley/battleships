<template>
  <div>
    <div class="button-group">
      <ButtonLink :disabled="!gameId" :to="joinUrl">
        PLAY
      </ButtonLink>
      <ButtonLink :disabled="!gameId" to="/join">
        JOIN
      </ButtonLink>
    </div>
  </div>
</template>

<script>

import ButtonLink from '../components/ButtonLink.vue'
import { uniqueGameCode } from '../scripts/services/gameService'
import { useUserStore } from '../store/userStore'

export default {
  name: 'IndexPage',
  components: {
    ButtonLink
  },
  emits: ['pageTitleChanged'],
  setup () {
    const store = useUserStore()
    return {
      store
    }
  },
  data () {
    return {
      gameId: null
    }
  },
  computed: {
    joinUrl () {
      return '/join/' + this.gameId
    }
  },
  mounted () {
    this.$emit('pageTitleChanged', 'BATTLESHIPS')
    this.gameId = uniqueGameCode()
  }
}
</script>

<style scoped>

.button-group {
  position:absolute;
  display:flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin-bottom: 80px;
}

</style>
