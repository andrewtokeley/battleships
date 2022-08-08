<template>
  <div class="icon" :class="{'icon--spinning': showSpinner}" :style="rotateStyle">
    <div
      ref="iconDiv"
      :title="tooltip"
      class="icon"
      :class="{
        'material-icons': isMaterialIconProp,
        'icon--clickable': derivedOptions.isClickable
      }"
      @click.prevent.stop="handleClick"
    >
      <svg v-if="!isMaterialIconProp">
        <path :d="derivedOptions.svgPath" />
      </svg>
      <span class="icon__text">
        <slot />
      </span>
    </div>

    <transition name="fade">
      <context-menu
        v-if="showContextMenu"
        ref="menu"
        :items="derivedOptions.menu.menuItems"
        :activate-element="iconDivElement"
        :right-aligned="derivedOptions.menu.rightAligned"
        @click="handleMenuClick"
        @close="showContextMenu = false"
      />
    </transition>
  </div>
</template>

<script>
// import ContextMenu from '../components/ContextMenu.vue'
import { constants } from '../scripts/constants'

export default {
  name: 'IconControl',
  // components: {
  //   ContextMenu
  // },
  props: {
    tooltip: {
      type: String,
      default: ''
    },
    rotate: {
      type: Number,
      default: 0
    },
    showSpinner: {
      type: Boolean,
      default: false
    },
    onWhite: {
      type: Boolean,
      required: false,
      default: true
    },
    options: {
      type: Object,
      default: null,
      required: false
    }
  },
  emits: ['click', 'menuClick'],
  data () {
    return {
      showContextMenu: false,
      isMouseOver: Boolean,
      isContextMenuOpen: false,
      iconDivElement: this.$refs.iconDiv
    }
  },
  computed: {
    rotateStyle () {
      if (this.rotate > 0) {
        return { transform: 'rotate(' + this.rotate + 'deg)' }
      }
      return {}
    },

    derivedOptions () {
      let options = this.options
      if (!options) {
        options = this.onWhite ? constants.ICON_OPTIONS.ON_WHITE : constants.ICON_OPTIONS.ON_DARK
      }
      // Defaults
      if (!options.isClickable) { options.isClickable = false }
      if (options.menu) {
        if (options.menu.rightAligned === null) { options.menu.rightAligned = true }
      }
      console.log('sss')
      return options
    },

    visibleMenuItems () {
      return this.derivedOptions.menu.menuItems.filter((m) => {
        if (m.show !== undefined) {
          return m.show
        }
        return true
      })
    },
    contextMenuOpen () {
      const menu = this.$refs.menu
      if (menu) {
        return menu.isOpen()
      }
      return false
    },

    isMaterialIconProp () {
      return this.$slots.default.length > 0
    }
  },

  mounted () {
    this.iconDivElement = this.$refs.iconDiv
    this.showContextMenu = false
    this.isMouseOver = false
    if (this.isMaterialIcon) {
      // set default state
      this.$refs.iconDiv.style.width = this.derivedOptions.background.size
      this.$refs.iconDiv.style.height = this.derivedOptions.background.size
      this.$refs.iconDiv.style.borderRadius = this.derivedOptions.background.borderRadius
      this.$refs.iconDiv.style.fontSize = this.derivedOptions.size ?? '32px'
      this.$refs.iconDiv.style.color = this.derivedOptions.colour ?? 'black'
      this.$refs.iconDiv.style.backgroundColor = this.derivedOptions.background.colour ?? 'white'
    }
    this.addListeners()
  },

  methods: {

    handleMenuClick (menuItem) {
      this.showContextMenu = false
      this.$emit('menuClick', menuItem)
      // if (menuItem.action) {
      //   this.$refs.menu.close();
      //   menuItem.action();
      // }
    },

    isMaterialIcon () {
      return this.derivedOptions.icon.materialIcon
    },

    addListeners () {
      const vm = this

      vm.$refs.iconDiv.addEventListener('mouseenter', () => {
        vm.isMouseOver = true
        // change the background colour based on options
        if (vm.derivedOptions.hover) {
          vm.$refs.iconDiv.style.color = vm.derivedOptions.hover.colour
          vm.$refs.iconDiv.style.backgroundColor = vm.derivedOptions.hover.backgroundColour
        }
      })

      this.$refs.iconDiv.addEventListener('mouseleave', () => {
        vm.isMouseOver = false
        if (vm.derivedOptions.background) {
          // return to default state. A race condition existed when you closed the sidebar by pressing
          // the cross and this code ran after the component was unmounted.
          if (vm.$refs.iconDiv) {
            vm.$refs.iconDiv.style.color = vm.derivedOptions.colour ?? 'black'
            vm.$refs.iconDiv.style.backgroundColor = vm.derivedOptions.background.colour ?? 'white'
          }
        }
      })
    },

    handleClick () {
      if (this.derivedOptions.menu) {
        this.showContextMenu = !this.showContextMenu
      } else if (this.derivedOptions.isClickable ?? true) {
        this.$emit('click')
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.icon {
  cursor: default;
  position: relative;
  background: transparent;
  transition: background 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon--clickable {
  cursor: pointer;
}

/* not using :hover to more easily control whether hover effect happens when context menu open */
.hover {
  background: rgba(255, 255, 255, 0.2);
}

svg {
  width: 20px;
  height: 20px;
}

path {
  stroke: white;
  stroke-width: 1px;
  fill: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* SPINNER */
.icon--spinning::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 4px solid transparent;
    border-top-color: var(--bs-blue);
    border-radius: 50%;
    animation: button-loading-spinner 1s ease infinite;
}

.icon--spinning .icon__text {
  visibility: hidden;
  opacity: 0;
}

@keyframes button-loading-spinner {
    from {
        transform: rotate(0turn);
    }
    to {
        transform: rotate(1turn);
    }
}
</style>
