<template>
  <div class="container">
    <loading-spinner v-if="!store.user.uid" :size="50" :border-size="7" message="loading..." />
    <span
      v-if="canClose"
      class="close-icon material-icons"
      @click="$router.go(-1)"
    >close</span>
    <Nuxt v-if="store.user.uid" />
  </div>
</template>

<script>
// Components
import LoadingSpinner from '../components/LoadingSpinner.vue'

// this import with anonymously log the user in
import '../scripts/services/auth'

// once logged in the store will be updated
import { useUserStore } from '../store/userStore'

export default {
  name: 'Default',
  components: {
    LoadingSpinner
  },
  setup () {
    const store = useUserStore()
    return {
      store
    }
  },
  data () {
    return {
      canClose: false
    }
  },
  head: {
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined' }
    ]
  },
  watch: {
    $route () {
      this.canClose = window.history.length !== 0 && this.$router.history.current.fullPath !== '/'
    }
  }
}
</script>

<style>
html {
  background: url(assets/battleships-cover.jpeg) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
    background-size: cover;
  }
</style>

<style scoped>

.container {
  margin-top: 90px
}

.close-icon {
  position: absolute;
  top:10px;
  right:10px;
  color: white;
  font-size: var(--bs-font-size-large);
}

</style>
