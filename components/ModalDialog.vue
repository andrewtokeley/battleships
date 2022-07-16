<template>
  <div class="modal__mask" @click="handleClose">
    <div
      :class="{ open: openPopup, close: closePopup }"
      class="popup"
    >
      {{ popupMessage }}
    </div>
    <div
      class="modal"
      :class="{
        'modal--fullscreen': fullscreen
      }"
      @click="preventClickPropogation"
    >
      <icon :options="iconOptions" class="modal__close-button" @click="handleClose">
        close
      </icon>
      <h1 v-if="title" class="modal__title">
        {{ title }}
      </h1>
      <div class="modal__content">
        <slot />
      </div>

      <div v-if="subTitle" class="modal__subTitle">
        <p>{{ subTitle }}</p>
      </div>

      <div v-if="actions" class="modal__footer">
        <template v-for="action in actions">
          <base-button
            :key="action.id"
            :is-primary="action.isPrimary"
            :is-secondary="action.isSecondary"
            :is-destructive="action.isDestructive"
            :show-spinner="action.showSpinner"
            @click.native="handleClick(action)"
          >
            {{ action.title }}
          </base-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapMutations } from 'vuex'
import { constants } from '../scripts/constants'

import BaseButton from '../components/BaseButton.vue'
import Icon from '../components/Icon'

export default {
  name: 'ModalDialog',

  components: {
    BaseButton,
    Icon
  },

  props: {
    title: {
      type: String,
      default: undefined
    },
    subTitle: {
      type: String,
      default: undefined
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    actions: {
      type: Array,
      default: () => { return [] }
    }
  },

  emits: ['close'],

  data () {
    return {
      openPopup: false,
      closePopup: true,
      popupMessage: '&nbsp;'
    }
  },

  computed: {
    iconOptions () {
      const options = { ...constants.ICON_OPTIONS.ON_WHITE_ACTIONABLE }
      options.size = '32px'
      options.background.size = '50px'
      // options.background.borderRadius = "3px";
      return options
    }
  },
  mounted () {
    this.showPopup(false)
  },
  methods: {
    handleClose () {
      // if there is a close handler, call it.
      const action = this.actions.find(a => a.isCloseAction)
      if (action) {
        action.handler()
      } else {
        this.$emit('close')
      }
    },
    showPopup (show) {
      this.openPopup = show
      this.closePopup = !show
    },
    handleEscape () {
      this.handleClose()
    },

    handleClick (action) {
      const result = action.handler(action)
      if (result && action.confirmationMessage) {
        this.popupMessage = action.confirmationMessage
        this.showPopup(true)
        const vm = this
        setTimeout(function () {
          vm.showPopup(false)
        }, 2000)
      }
    },

    // ...mapMutations({
    //   addShortcutListener: 'ADD_SHORTCUT_LISTENER',
    //   removeShortcutListener: 'REMOVE_SHORTCUT_LISTENER'
    // }),

    preventClickPropogation (e) {
      e.stopPropagation()
    }

    // attachListeners() {
    //   let vm = this;
    //   document.addEventListener('keydown', this.escapeListener, { once: true });
    // },

    // escapeListener(evt) {
    //   // prevent the escape click propogating to other modals
    //   evt.stopPropagation();
    //   var isEscape = false;
    //   if ("key" in evt) {
    //     isEscape = evt.key === "Escape" || evt.key === "Esc";
    //   } else {
    //     isEscape = evt.keyCode === 27;
    //   }
    //   if (isEscape) {
    //     console.log("CLOSE " + this.title);
    //     this.$emit('close');
    //   }
    // }

  }

}
</script>

<style scoped>
.modal__mask {
  z-index: 1000;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal {
  display:flex;
  flex-direction: column;
  position: relative;
  max-width: 500px;
  min-width: 350px;
  max-height: 90%;
  background-color: white;
  border-radius: 5px;
  padding: 20px 20px;
  box-sizing: border-box;
}

h1.modal__title {
  margin-top: 0px;
  color: var(--bs-darkgrey);
  font-size: var(--bs-font-size-large);
  text-align: left;
}

.modal__close-button {
  position:absolute;
  right: 10px;
  top: 10px;
}

.modal--fullscreen {
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  padding: 60px 60px;
  border-radius: 0px;
}

.modal__heading {
  height: 30px;
  font-weight: bold;
  font-size: var(--bs-font-size-large);
  display: flex;
  align-items: center;
}

.modal__content {
  color: var(--bs-mediumgrey);
  padding-top: 0em;
  padding-bottom: 2em;
  box-sizing: border-box;
  flex-grow: 1;
  overflow-y: scroll;
}

.modal__subTitle {
  height: 40px;
  color: var(--bs-mediumgrey);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal__footer {
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
}

.popup {
  position: relative;
  width: 200px;
  /* top: -150px;
  right: 20px; */
  /* background: var(--bs-darkgrey); */
  background: white;
  color: var(--bs-darkgrey);
  padding: 10px 20px;
  border-radius: 5px;
  text-align: center;
  transition: top 500ms, opacity 500ms;
  opacity: 0;
  margin-bottom: 20px;
}

.popup.close {
  /* top: -150px; */
  opacity: 0;
}

.popup.open {
  /* top: 50px; */
  opacity: 1;
}

@media only screen and (max-width: 600px) {
  .modal {
    max-width: 95%;
  }
}
</style>
