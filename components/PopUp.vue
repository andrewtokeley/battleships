<template>
  <div class="popup" :class="{'animate-in': animateIn, 'animate-out': animateOut}">
    <div>
      {{ message }} <span v-if="subMessage" :style="{color: subMessageColour}">
        {{ subMessage }}
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PopUp',
  props: {
    message: {
      type: String,
      default: ''
    },
    subMessage: {
      type: String,
      default: ''
    },
    subMessageColour: {
      type: String,
      default: 'white'
    }
  },
  emits: ['close'],
  data () {
    return {
      delay: 2000,
      animateOut: false,
      animateIn: false
    }
  },
  mounted () {
    // animate in immediately (will take 500ms)
    setTimeout(() => {
      this.animateIn = true
      console.log('fade in')
    }, 0)

    // wait delay, then animate away
    setTimeout(() => {
      this.animateOut = true
      this.animateIn = false
      console.log('fade out')
    }, this.delay)

    // close 500ms (the time it takes the animateOut to finish)
    setTimeout(() => {
      console.log('close')
      this.$emit('close')
    }, 3000)
  }
}
</script>

<style scoped>

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1px;
  height: 1px;
  transition: width 0.5s, height 0.5s, font-size 0.5s;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  max-width: 300px;
  background-color: black;
  border-radius: 10px;
  color: white;
  font-size: 0em;
}

.popup.animate-in {
  width: 75%;
  height: 150px;
  font-size: 1.3em;
}

.popup.animate-out {
  width: 0ch;
  height: 0px;
  font-size: 0em;
}

.popup div {
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
  text-transform: capitalize;
}
</style>
