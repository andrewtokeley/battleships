<template>
  <div />
</template>

<script>

// import { FontAwesome } from '../scripts/FontAwesome'

export default {
  name: 'BattleShip',
  props: {
    canvasContext: null,
    board: null,
    config: {
      type: Object,
      default: () => {
        return {
          id: 0,
          location: { row: 0, column: 0 },
          length: 4,
          vertical: true,
          colour: 'white'
        }
      }
    },
    selected: {
      type: Boolean,
      default: false
    },
    moving: {
      type: Boolean,
      default: false
    },
    redraw: {
      type: Number,
      default: 0
    }
  },
  computed: {
    coordinates () {
      return this.board.layout.coordinatesAt(this.config.location, false)
    }
  },
  watch: {
    selected () {
      this.draw(this.canvasContext)
    },
    redraw () {
      this.draw(this.canvasContext)
    }
  },
  mounted () {
    console.log('draw bs')
    this.draw(this.canvasContext, false)
  },
  methods: {
    draw (ctx) {
      const internalCellSize = this.board.layout.cellSize - 2 * this.board.layout.gridLineWidth
      const coords = this.coordinates
      const rect = {
        x: coords.x + this.board.layout.gridLineWidth,
        y: coords.y + this.board.layout.gridLineWidth,
        width: this.config.vertical ? internalCellSize : this.board.layout.cellSize * this.config.length - 2 * this.board.layout.gridLineWidth,
        height: this.config.vertical ? this.board.layout.cellSize * this.config.length - 2 * this.board.layout.gridLineWidth : internalCellSize
      }
      // Filled Rectangle (when not moving or selected)
      ctx.beginPath()

      ctx.rect(rect.x, rect.y, rect.width, rect.height)
      ctx.fillStyle = this.config.colour

      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)

      ctx.shadowBlur = this.selected ? 10 : 0
      ctx.shadowColor = this.selected ? 'black' : 'white' // '#2363b6'
      // ctx.strokeStyle = this.selected ? 'red' : 'clear'
      // ctx.lineWidth = this.selected ? 3 : 0

      ctx.fill()

      // Rotate icon
      ctx.fillStyle = 'white'
      ctx.font = '48px Material Icons'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const offset = { x: this.board.layout.cellSize / 2, y: this.board.layout.cellSize / 2 }
      // ctx.fillText(this.selected ? 'open_with' : ' ', coords.x + offset.x, coords.y + offset.y)
      if (this.config.vertical) {
        ctx.fillText(this.selected ? 'replay' : ' ', coords.x + offset.x, coords.y + offset.y)
      } else {
        ctx.fillText(this.selected ? 'refresh' : ' ', coords.x + offset.x, coords.y + offset.y)
      }
    }
  }
}
</script>
