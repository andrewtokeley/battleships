<template>
  <div>
    <div class="button-group">
      <ButtonLink :to="newGameUrl">
        PLAY
      </ButtonLink>
      <ButtonLink to="/join">
        JOIN
      </ButtonLink>
    </div>
  </div>
</template>

<script>

import ButtonLink from '../components/ButtonLink.vue'
import { useUserStore } from '../store/userStore'
import { uniqueGameCode } from '../scripts/services/gameService'

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
      newGameId: ''
    }
  },
  computed: {
    newGameUrl () {
      return `/join/${this.newGameId}?new=true`
    }
  },
  async mounted () {
    this.newGameId = await uniqueGameCode()
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
