<template>
  <div class="popup" :class="{animate: animateNow}">
    <div>{{ message }}</div>
  </div>
</template>

<script>

export default {
  name: 'PopUp',
  props: {
    message: {
      type: String,
      default: ''
    }
  },
  emits: ['close'],
  data () {
    return {
      delay: 3000,
      animateNow: false
    }
  },
  mounted () {
    // pause the given delay
    // then emit a close event for the client to close
    setTimeout(() => { this.animateNow = true }, 0)
    setTimeout(() => { this.$emit('close') }, this.delay)
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

.popup.animate {
  width: 80%;
  height: 150px;
  font-size: 1.5em;
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
