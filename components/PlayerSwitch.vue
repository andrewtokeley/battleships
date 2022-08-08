<template>
  <div class="player-switch">
    <div class="spacer" />
    <button class="button" :class="{ active: activeTab === 1 }" @click="handleSwitch(1)">
      {{ player1Name.toUpperCase() }}
      <div class="material-icons" :class="{ active: yourMove !== null && !yourMove && yourHitResult === null, hit: yourHitResult === true, miss: yourHitResult === false }">
        circle
      </div>
    </button>
    <button v-if="player2Name" class="button" :class="{ active: activeTab === 2 }" @click="handleSwitch(2)">
      {{ player2Name.toUpperCase() }}
      <div class="material-icons" :class="{ active: yourMove }">
        circle
      </div>
    </button>
    <div class="spacer" />
  </div>
</template>

<script>
import { constants } from '../scripts/constants'

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
    },
    yourMove: {
      type: Boolean,
      default: false
    },
    // The result of an opponent hitting at your ships
    yourHitResult: {
      type: Boolean,
      default: null
    },
    initialTab: {
      type: Number,
      default: 1
    }
  },
  emits: ['change'],
  data () {
    return {
      activeTab: this.initialTab
    }
  },
  computed: {
    indicatorIconOptions1 () {
      const options = { ...constants.ICON_OPTIONS.INDICATOR }
      options.colour = this.player1IndicatorColour
      options.isClickable = false
      return options
    },
    indicatorIconOptions2 () {
      const options = { ...constants.ICON_OPTIONS.INDICATOR }
      options.colour = this.player2IndicatorColour
      options.isClickable = false
      return options
    }
  },
  watch: {
    initialTab () {
      this.activeTab = this.initialTab
    }
  },
  methods: {
    handleSwitch (tab) {
      this.activeTab = tab
      this.$emit('change', this.activeTab)
    }
  }

}
</script>
<style scoped>
div.material-icons {
  float:right;
  color: transparent;
  font-size: 1em;
  padding-top: 0.3em;
}

div.material-icons.active {
  color: green;
}

div.material-icons.hit {
  color: red;
}
div.material-icons.miss {
  color: white;
}

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
  height: 40px;
  line-height: 40px;
}

.button.active {
  background: var(--bs-blue);
  color: white;
  border-width: 1px 1px 0px 1px;
  border-style: solid;
  border-color: var(--bs-lightblue);
}
</style>
