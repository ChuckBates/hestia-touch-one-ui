<template>
  <div id="app" :class="colorClass">
    <!-- Sleep overlay: full-black, catches the wake tap so it doesn't also hit a control underneath -->
    <div
      v-if="asleep"
      class="sleep-overlay"
      @touchstart.stop.prevent="wake"
      @mousedown.stop.prevent="wake"
      @click.stop.prevent="wake"
    ></div>
    <info-screen v-if="showInfoScreen" />
    <home-screen v-if="!showInfoScreen" />
  </div>
</template>

<script>
import 'typeface-roboto'
import homeScreen from './home-screen.vue'
import infoScreen from './info-screen.vue'

// Auto-sleep: after this much inactivity (no touch), blank the screen and cut the
// LCD backlight. Configurable — change this one value (ms). Could later be driven
// from the store / MQTT if runtime configuration is wanted.
const SLEEP_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes of inactivity → sleep

export default {
  components: {
    homeScreen,
    infoScreen
  },
  data() {
    return {
      asleep: false,
      idleTimer: null
    }
  },
  mounted() {
    // Reset the idle timer on any user interaction while awake.
    this._onActivity = () => { if (!this.asleep) this.resetIdleTimer() }
    ;['touchstart', 'mousedown', 'keydown'].forEach(evt =>
      window.addEventListener(evt, this._onActivity, { passive: true })
    )
    this.resetIdleTimer()
  },
  beforeDestroy() {
    ;['touchstart', 'mousedown', 'keydown'].forEach(evt =>
      window.removeEventListener(evt, this._onActivity)
    )
    clearTimeout(this.idleTimer)
  },
  methods: {
    resetIdleTimer() {
      clearTimeout(this.idleTimer)
      this.idleTimer = setTimeout(() => this.sleep(), SLEEP_TIMEOUT_MS)
    },
    sleep() {
      if (this.asleep) return
      this.asleep = true
      this.$store.commit('setBacklight', false)
    },
    wake() {
      if (!this.asleep) return
      this.asleep = false
      this.$store.commit('setBacklight', true)
      this.resetIdleTimer()
    }
  },
  computed: {
    colorClass() {
      const mode = this.$store.state.selectedMode
      if (mode && this.$store.state.modes[mode].active) {
        return {
          [`color-${mode}`]: true
        }
      }
      return {
        'color-off': true
      }
    },
    showInfoScreen() {
      return this.$store.state.showInfoScreen
    }
  }
}
</script>

<style>
html * {cursor:none!important}

/* Auto-sleep overlay: full-screen black, above everything, catches the wake tap */
.sleep-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  z-index: 2147483647;
}

html {
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  background-color: black;
  overflow: hidden;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

/* Hide kweb scroolbar */
#element::-webkit-scrollbar {
  display: none;
}

.color-cool {
  color: #6ad0ff;
}

.color-heat {
  color: #fda64e;
}

.color-humidity {
  color: rgb(147,60,255);
}

.color-fan {
  color: #75ff65;
}

.color-hotwater {
  color: aqua;
}

.color-off {
  color: #e0e5e8;
}

/* Prevent dragging screen text when tapping */
.unselectable {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: -moz-none; /* Firefox */
  -ms-user-select: none; /* IE */
  user-select: none; /* Standard */
}
</style>
