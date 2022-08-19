<template>
  <div class="background">
    <div class="title" />
    <error-display v-if="showError" title="Yikes!" :error="error" @close="showError = false" />
    <div class="button-group">
      <BaseButton class="action-button" @click.native="$router.push(`/new`)">
        NEW GAME
      </BaseButton>
      <BaseButton class="action-button" @click.native="$router.push(`/join`)">
        JOIN
      </BaseButton>
    </div>
  </div>
</template>

<script>

import BaseButton from '../components/BaseButton.vue'
import ErrorDisplay from '../components/ErrorDisplay.vue'
import { GameDefaultError } from '../scripts/Types'

export default {
  name: 'IndexPage',
  components: {
    BaseButton,
    ErrorDisplay
  },
  data () {
    return {
      showError: false
    }
  },
  mounted () {
    const errorCode = this.$route.query.error
    if (errorCode) {
      this.error = new GameDefaultError(`Something went wrong (${errorCode})`)
      this.showError = true
    }
  }
}
</script>

<style scoped>

p {
  color: var('--bs-darkblue');
}

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
  position: absolute;
    width: 90%;
    height: 5%;
    top: 120px;
    left: 0px;
    right: 0px;
    margin-left: auto;
    margin-right: auto;
    background-image: url('~@/assets/battleship_title.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}

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

.action-button {
  width: 40%;
  max-width: 200px;
}

</style>
