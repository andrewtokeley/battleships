<template>
  <div class="modal__mask" @click="$emit(&quot;close&quot;)">
    <div
      class="modal"
      :class="{
        'modal--fullscreen': fullscreen
      }"
      @click="preventClickPropogation"
    >
      <icon :options="iconOptions" class="modal__close-button" @click="$emit(&quot;close&quot;)">
        close
      </icon>
      <h1 v-if="title">
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
          <button-link
            :key="action.id"
            :is-primary="action.isPrimary"
            :is-secondary="action.isSecondary"
            :is-destructive="action.isDestructive"
            :show-spinner="action.showSpinner"
            @click="handleClick(action)"
          >
            {{ action.title }}
          </button-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapMutations } from 'vuex'
import { constants } from '../scripts/constants'

import ButtonLink from '../components/ButtonLink.vue'
import Icon from '../components/Icon'

export default {
  name: 'ModalDialog',

  components: {
    ButtonLink,
    // CloseDialogButton,
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
    // this.addShortcutListener(
    //   {
    //     name: this.title,
    //     callback: this.handleEscape,
    //     listenTo: ['esc', 'Escape', 27]
    //   }
    // )
  },
  // unmounted () {
  //   this.removeShortcutListener(this.title)
  // },

  methods: {
    handleEscape () {
      this.$emit('close')
    },

    handleClick (action) {
      action.handle(action)
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
  font-size: var(--ish-font-size-large);
  display: flex;
  align-items: center;
}

.modal__content {
  color: var(--ish-mediumgrey);
  font-size: 1em;
  padding-top: 1em;
  padding-bottom: 0em;
  box-sizing: border-box;
  flex-grow: 1;
  overflow-y: scroll;
}

.modal__subTitle {
  height: 40px;
  color: var(--ish-mediumgrey);
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

@media only screen and (max-width: 600px) {
  .modal {
    max-width: 95%;
  }
}
</style>
