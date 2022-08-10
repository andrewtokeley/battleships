<template>
  <div
    ref="context"
    class="context-menu"
    :style="style"
    tabindex="0"
    @blur="blur"
  >
    <template v-for="menuItem in visibleMenuItems">
      <div :key="menuItem.id">
        <hr v-if="menuItem.isDivider" class="divider">
        <div
          v-else
          class="context-menu__row"
          :class="{
            'context-menu__row--isCentred': menuItem.isFullWidth,
            'context-menu__row--isLabel': menuItem.isLabel,
          }"
          @click="handleMenuItemClick($event, menuItem)"
        >
          <div
            v-if="!menuItem.isFullWidth"
            class="context-menu__row__icon"
          >
            <icon
              v-if="menuItem.iconName"
              :options="iconOptions"
              @click="handleMenuItemClick(nil, menuItem)"
            >
              {{ menuItem.iconName }}
            </icon>
          </div>
          <div
            class="context-menu__row__text"
            :class="{
              'context-menu__row__small': menuItem.isFullWidth,
            }"
          >
            <div>{{ menuItem.name }}</div>
            <div
              v-if="menuItem.subText"
              class="context-menu__row__subText"
            >
              {{ menuItem.subText }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// import { nextTick } from 'vue'
import { constants } from '../scripts/constants'

export default {
  name: 'ContextMenu',

  components: {},

  props: {
    // must be supplied so the context menu is position relatively to it.
    activateElement: {
      type: HTMLDivElement,
      default: undefined
    },
    rightAligned: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array,
      required: true
    }
  },

  emits: ['opened', 'close', 'click'],

  data () {
    return {
      left: 0,
      top: 0,
      right: 0,
      // show: false,
      delayTimer: Object
    }
  },

  computed: {
    iconOptions () {
      const options = { ...constants.ICON_OPTIONS.ON_WHITE }
      options.isClickable = true
      return options
    },
    // get position of context menu

    style () {
      return {
        top: this.top + 'px',
        left: this.left + 'px'
      }
    },

    visibleMenuItems () {
      return this.items.filter(item => item.show ?? true)
    }
  },

  beforeCreate () {
    // Not sure why this worked and importing Icon didn't. Something to do with the fact that
    // Icon contains ContextMenu which contains Icon...
    this.$options.components.Icon = require('./Icon').default
  },

  mounted () {
    this.open(this.activateElement.getBoundingClientRect())
  },

  methods: {
    handleMenuItemClick (event, menuItem) {
      if (event) {
        event.stopPropagation()
      }
      if (menuItem.isClickable ?? true) {
        this.$emit('click', menuItem)
      }
    },

    blur () {
      const vm = this
      this.delayTimer = setTimeout(function () {
        vm.close()
      }, 200)
    },

    // closes context menu
    close () {
      this.$emit('close')
    },

    open (activateElementBounds) {
      // updates position of context menu
      this.top = activateElementBounds.bottom
      if (this.rightAligned) {
        this.left =
                    activateElementBounds.left -
                    (250 -
                        (activateElementBounds.right -
                            activateElementBounds.left))
      } else {
        this.left = activateElementBounds.left
      }

      // make element focused (so blur event happens to close it)
      // @ts-ignore
      const vm = this
      this.$nextTick(() => vm.$refs.context.focus())
      this.show = true
      this.$emit('opened')
    },

    isOpen () {
      return this.show
    }
  }
}
</script>
<style>
.context-menu-mask {
    z-index: 1;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: transparent;
}

.context-menu {
    position: fixed;
    padding: 10px 0px;
    outline: none;
    width: 250px;
    z-index: 999;
    background: white;
    border-radius: 5px;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
        0 2px 6px 2px rgba(60, 64, 67, 0.15);
}

.context-menu__row {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    cursor: default;
    color: var(--bs-darkgrey);
    font-size: var(--bs-font-size-normal);
    /* height: 25px; */
    /* font-size: 0.875rem; */
    height: 1.25rem;
}

.context-menu__row:hover {
    background: var(--bs-lightgrey);
    cursor: pointer;
}

.context-menu__row--isLabel {
    color: var(--ish-mediumgrey);
    font-style: italic;
}
.context-menu__row--isLabel:hover {
    background: transparent;
    cursor: default;
}

.context-menu__row--isSmallText {
    font-size: var(--bs-font-size-small);
}

.context-menu__row--isCentred {
    justify-content: center;
}

.context-menu__row__icon {
    width: 30px;
    padding-right: 10px;
}

.context-menu__row__text {
    display: flex;
    flex-direction: column;
}

.context-menu__row__subText,
.context-menu__row-full-width {
    font-size: var(--bs-font-size-small);
}

.context-menu__row__subText {
    justify-content: center;
}

.closeButton {
    top: 2px;
    right: 2px;
    position: absolute;
}

.divider.short {
    margin-left: 20px;
    margin-right: 20px;
}
</style>
