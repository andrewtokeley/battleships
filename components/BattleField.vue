<template>
  <div class="container">
    <canvas ref="canvas" class="battlefield" width="1000" height="1000" />
    <template v-if="Boolean(canvasContext) && Boolean(board)">
      <slot :context="canvasContext" :board="board" />
    </template>
  </div>
</template>

<script>
// import { BattlefieldLayout } from '../scripts/BattlefieldLayout'

export default {
  name: 'BattleField',
  props: {
    redraw: {
      type: Number,
      default: 0
    },
    cursor: {
      type: String,
      default: 'default'
    },
    board: {
      type: Object,
      default: null
    }
  },
  emits: ['cellSelected', 'drag', 'dragDrop'],
  data () {
    return {
      canvasContext: null,
      previousSelectedCell: {
        type: Object,
        default: {}
      },
      dragStarted: false,
      dragging: false,
      lastMoveLocation: {
        type: Object,
        default: {}
      }
    }
  },
  watch: {
    redraw () {
      this.draw()
    },
    cursor () {
      this.$refs.canvas.style.cursor = this.cursor
    }
  },
  mounted () {
    this.canvasContext = this.$refs.canvas.getContext('2d')
    this.draw()
    this.attachEventHandlers()
  },
  methods: {

    attachEventHandlers () {
      const canvas = this.$refs.canvas
      const vm = this
      const selectEvents = ['mouseup', 'touchend']
      selectEvents.forEach(e => canvas.addEventListener(e, vm.handleMouseUp, false))

      const dragStartEvents = ['mousedown', 'touchstart']
      dragStartEvents.forEach(e => canvas.addEventListener(e, vm.handleMouseDown, false))

      const dragEvents = ['mousemove', 'touchmove']
      dragEvents.forEach(e => canvas.addEventListener(e, vm.handleMove, false))
    },

    singleEvent (e) {
      if (e.type === 'touchend') {
        // get the screen coordinates from the last move event. TouchEnd doesn't have it
        return this.lastMoveLocation ?? this.previousSelectedCell
      } else if (e.touches && e.touches.length >= 1) {
        return e.touches[0]
      }
      // non touch events will pass through here
      return e
    },

    gridRef (screenCoordinates) {
      const coordinates = this.board.layout.convertToCanvasCoordinates(this.$refs.canvas, screenCoordinates.x, screenCoordinates.y)
      return this.board.layout.gridReferenceAt(coordinates.x, coordinates.y)
    },

    handleMouseUp (evt) {
      // always stop dragging if we're here
      this.dragStarted = false

      // some events will come from touch events, we only care about the first event (finger)
      const e = this.singleEvent(evt)
      const gridRef = this.gridRef({ x: e.clientX, y: e.clientY })
      if (this.dragging) {
        this.dragging = false
        this.$emit('dragDrop', { row: gridRef.row, column: gridRef.column })
      } else {
        // selected a cell
        console.log('cellSelected ' + evt.type + '(' + gridRef.row + ',' + gridRef.column)
        this.$emit('cellSelected', { row: gridRef.row, column: gridRef.column })
      }
    },

    handleMouseDown (evt) {
      this.dragStarted = true

      const e = this.singleEvent(evt)
      this.lastMoveLocation = { clientX: e.clientX, clientY: e.clientY }
      const gridRef = this.gridRef({ x: e.clientX, y: e.clientY })
      this.previousSelectedCell = gridRef
    },

    /**
     * Raises drag event when dragging moves across a cell boundary
     */
    handleMove (evt) {
      // Unless you've just pressed MouseDown, we don't care about moving the mouse
      if (!this.dragStarted) {
        return
      }

      this.dragging = true

      // some events will come from touch events, we only care about the first event (finger)
      const e = this.singleEvent(evt)
      this.lastMoveLocation = { clientX: e.clientX, clientY: e.clientY }
      const gridRef = this.gridRef({ x: e.clientX, y: e.clientY })

      if (gridRef.row !== this.previousSelectedCell.row || gridRef.column !== this.previousSelectedCell.column) {
        this.$emit('drag', {
          from: this.previousSelectedCell,
          to: gridRef
        })

        this.previousSelectedCell = gridRef
      }
    },

    /**
     * Draw the grid
     */
    draw () {
      const ctx = this.canvasContext
      const cellSize = this.board.layout.cellSize
      const gridLineWidth = this.board.layout.gridLineWidth
      const width = this.board.layout.resolution

      this.canvasContext.fillStyle = '#2363b6'
      this.canvasContext.fillRect(0, 0, width, width)

      ctx.strokeStyle = 'white'
      let y = gridLineWidth
      for (let i = 0; i < (cellSize + 1); i++) {
        // Vertical
        this.canvasContext.beginPath()
        this.canvasContext.moveTo(gridLineWidth, y)
        this.canvasContext.lineTo(width, y)
        this.canvasContext.stroke()
        y = y + cellSize
      }
      let x = gridLineWidth
      for (let i = 0; i < (cellSize + 1); i++) {
        // Horizontal
        this.canvasContext.beginPath()
        this.canvasContext.moveTo(x, gridLineWidth)
        this.canvasContext.lineTo(x, width)
        this.canvasContext.stroke()
        x = x + cellSize
      }
    }
  }
}

</script>

<style scoped>

.container {
  display:flex;
  flex-direction: row;
  justify-content: center;
}

.battlefield {
  /* position:absolute; */
  background-color: #0b5394ff;
  width: 50%;
  height: 50%;
}

@media only screen and (max-width: 600px) {
  .battlefield {
  width: 100%;
  height: 100%;
  }
}

</style>
