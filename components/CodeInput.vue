<template>
  <div class="code-input">
    <input
      v-for="i in [0,1,2,3,4]"
      :id="i"
      :key="i"
      :ref="`char${i}`"
      :disabled="disabled"
      maxlength="1"
      class="character"
      onFocus="this.select();"
      onkeydown="return /[a-z]/i.test(event.key)"
      autocomplete="off"
      autocapitalize="on"
      autocorrect="off"
      spellcheck="false"
      @keyup="handleChange"
    >
  </div>
</template>

<script>

export default {
  name: 'CodeInput',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    // The bound value of the input, set by clients using the v-model property
    modelValue: {
      type: String,
      default: '     '
    },
    disabled: {
      type: Boolean,
      default: false
    },
    focusIndex: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue'],
  watch: {
    modelValue () {
      this.setInputs()
    }
  },
  mounted () {
    // initialise characters
    this.setInputs()

    // set the focus on the first character
    if (this.focusCharacter >= 0 && this.focusCharacter < 5) {
      this.$refs.char0[this.focusCharacter].focus()
    }
  },
  methods: {
    setInputs () {
      this.$refs.char0[0].value = this.modelValue.charAt(0)
      this.$refs.char1[0].value = this.modelValue.charAt(1)
      this.$refs.char2[0].value = this.modelValue.charAt(2)
      this.$refs.char3[0].value = this.modelValue.charAt(3)
      this.$refs.char4[0].value = this.modelValue.charAt(4)
    },
    handleChange (event) {
      if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
        const newValue = this.$refs.char0[0].value +
          this.$refs.char1[0].value +
          this.$refs.char2[0].value +
          this.$refs.char3[0].value +
          this.$refs.char4[0].value
        this.$emit('update:modelValue', newValue.toUpperCase())

        // set the focus to the next input
        const index = Number(event.target.id)
        if (index < 4) {
          this.$refs[`char${index + 1}`][0].focus()
        } else {
          this.$refs.char0[0].focus()
        }
      }
    }
  }
}

</script>

<style scoped>

.code-input {
  display:flex;
  flex-direction: row;
}

input {
  width: 50px;
  height: 50px;
  margin-right: 2px;
  background-color: beige;
  border: 1px var(--bs-green) solid;
  text-align: center;
  font-size: var(--bs-font-size-large);
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  color: var(--bs-green);
  text-transform: uppercase;
  outline: none;
}

input:focus {
  background-color: #E0E09A;
}

::-moz-selection { /* Code for Firefox */
  background-color: #E0E09A;
}

::selection {
  background-color: #E0E09A;
}

</style>
