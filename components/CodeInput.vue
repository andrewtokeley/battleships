<template>
  <div class="code-input">
    <input
      v-for="i in Array.from(Array(numberOfCharacters).keys())"
      :id="`char${i}`"
      :key="i"
      :disabled="disabled"
      maxlength="1"
      class="character"
      autocomplete="off"
      autocapitalize="on"
      autocorrect="off"
      spellcheck="false"
      type="text"
      placeholder=""
      @keydown="handleKeyDown"
      @input="handleInput"
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
    },
    numberOfCharacters: {
      type: Number,
      default: 5
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      inputs: []
    }
  },
  watch: {
    modelValue () {
      this.setInputValues(this.modelValue)
    }
  },
  mounted () {
    this.defineInputs()

    // set the inital value of each input, based on modelValue
    this.setInputValues(this.modelValue)

    // set the focus on the first character
    if (this.focusIndex >= 0 && this.focusIndex < 5) {
      this.inputs[this.focusIndex].focus()
    }
  },
  methods: {
    defineInputs () {
      this.inputs = []
      for (let i = 0; i < this.numberOfCharacters; i++) {
        this.inputs.push(document.getElementById(`char${i}`))
      }
    },
    setInputValues (value) {
      for (let i = 0; i < this.numberOfCharacters; i++) {
        this.inputs[i].value = value.charAt(i).trim()
      }
    },
    handleKeyDown (event) {
      const i = Number(event.target.id.substring(4))
      if (event.key === 'Backspace') {
        if (this.inputs[i].value === '') {
          if (i !== 0) {
            this.inputs[i - 1].focus()
          }
        } else {
          this.inputs[i].value = ''
          this.updateModelValue()
        }
      } else if (event.key === 'ArrowLeft' && i !== 0) {
        this.inputs[i - 1].focus()
      } else if (event.key === 'ArrowRight' && i !== this.inputs.length - 1) {
        this.inputs[i + 1].focus()
      } else if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        this.inputs[i].setAttribute('type', 'text')
        // this.inputs[i].value = '' // Bug Fix: allow user to change a random otp digit after pressing it
      }
    },
    handleInput (event) {
      const i = Number(event.target.id.substring(4))
      this.inputs[i].value = this.inputs[i].value.toUpperCase() // Converts to Upper case. Remove .toUpperCase() if conversion isnt required.
      this.updateModelValue()
      if (i === this.inputs.length - 1 && this.inputs[i].value !== '') {
        return true
      } else if (this.inputs[i].value !== '') {
        this.inputs[i + 1].focus()
      }
    },
    updateModelValue () {
      let newValue = ''
      for (let i = 0; i < this.numberOfCharacters; i++) {
        const char = this.inputs[i].value
        newValue += (char === '' ? ' ' : char)
      }
      this.$emit('update:modelValue', newValue.toUpperCase())
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
  text-align: center;
  font-size: var(--bs-font-size-large);
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  color: var(--bs-green);
  text-transform: uppercase;
  outline: none;
  border: 2px solid transparent;
}

input:focus {
  background-color: #E0E09A;
  border: var(--bs-blue) 2px solid;
}

::-moz-selection { /* Code for Firefox */
  background-color: #E0E09A;
}

::selection {
  background-color: #E0E09A;
}

</style>
