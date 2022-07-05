<template>
  <div class="global-container">
    <div class="container">
      <loading-spinner
        v-if="!store.user.uid"
        class="loading-spinner"
        :size="50"
        :border-size="7"
        message="loading..."
      />
      <div v-else>
        <div :style="{visibility: canClose ? 'visible' : 'hidden'}" class="close-icon material-icons" @click="handleBackNav">
          close
        </div>
        <h1 :style="{visibility: pageTitle ? 'visible' : 'hidden'}" class="page-heading">
          {{ pageTitle }}
        </h1>
        <Nuxt v-if="store.user.uid" />
      </div>
    </div>
  </div>
</template>

<script>
// Components
import LoadingSpinner from '../components/LoadingSpinner.vue'

// this import with anonymously log the user in
import '../scripts/services/auth'

// once logged in the store will be updated
import { useUserStore } from '../store/userStore'
import convertPageTitle from '../scripts/pageTitle'

export default {
  name: 'DefaultLayout',
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
      canClose: false,
      pageTitle: ''
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
      this.handleRouteChanged()
    }
  },
  mounted () {
    this.handleRouteChanged()
  },
  methods: {
    handleRouteChanged () {
      this.canClose = window.history.length !== 0 && this.$router.history.current.fullPath !== '/'
      this.pageTitle = convertPageTitle(this.$route.name)
    },
    handleBackNav () {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
html {
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  margin: 0px;
}
</style>

<style scoped>

.global-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  max-width: 800px;
  height: 80%;
  background: url(assets/battleships-cover.jpeg) no-repeat center center fixed;
}

.close-icon {
  float:right;
  margin:20px;
  color: white;
  font-size: var(--bs-font-size-large);
  cursor:pointer;
}
.loading-spinner {
  margin-top: 100px;
}

@media only screen and (max-width 600px) {
  .container {
    max-width: none;
  }
}
</style>
