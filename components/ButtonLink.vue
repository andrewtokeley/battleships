<template>
  <NuxtLink
    :disabled="disabled"
    :to="to"
    class="base-button"
    :class="{
      'base-button--danger': isDestructive,
      'base-button--secondary': isSecondary,
      'base-button--spinning': showSpinner,
      'base-button--transparent': isTransparent,
    }"
  >
    <span class="base-button__text">
      <slot />
    </span>
  </NuxtLink>
</template>

<script>

export default {
  name: 'ButtonLink',
  props: {
    to: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isDestructive: {
      type: Boolean,
      default: false
    },
    isSecondary: {
      type: Boolean,
      default: false
    },
    isTransparent: {
      type: Boolean,
      default: false
    },
    showSpinner: {
      type: Boolean,
      default: false
    }
  }

}
</script>

<style scoped>
.base-button {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  border-radius: 3px;
  text-align: center;
  text-decoration: none;
  font-size: var(--bs-font-size-medium);
  font-weight: var(--bs-font-weight);
  border: 1px solid var(--bs-blue);
  margin-left: 10px;
  background: var(--bs-blue);
  color: white;
  /* height: 40px; */
  width: 100px;
  vertical-align: middle;
  transition: background 400ms;
}

.base-button:focus {
  outline: none;
}

.base-button:hover {
  cursor: pointer;
}

.base-button:disabled {
  cursor: default;
  background: white;
  color: var(--ish-mediumgrey);
  border: 1px solid var(--bs-lightgrey);
}

/* TRANSPARENT */
.base-button--transparent {
  background: transparent;
  color: var(--bs-blue);
  border: 1px transparent solid;
}

.base-button--secondary:hover {
  background: transparent;
}

/* SECONDARY */
.base-button--secondary {
  background: white;
  color: var(--bs-blue);
  border: 1px var(--bs-lightgrey) solid;
}

.base-button--secondary:hover {
  background: var(--bs-lightgrey);
}

/* DANGER */
.base-button--danger {
  background: var(--bs-red);
  color: white;
  border: 1px var(--bs-red) solid;
}

/* SPINNER */
.base-button--spinning::after {
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
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: button-loading-spinner 1s ease infinite;
}

.base-button--spinning .base-button__text {
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
