<template>
  <div />
</template>

<script>

export default {
  name: 'MissilePeg',
  props: {
    canvasContext: null,
    board: null,
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    redraw: {
      type: Number,
      default: 0
    }
  },
  watch: {
    redraw () {
      console.log('missile redraw')
      this.draw(this.canvasContext)
    }
  },
  mounted () {
    this.draw(this.canvasContext)
  },
  methods: {
    draw (ctx) {
      const coordinates = this.board.layout.coordinatesAt(this.config.location, true)
      const radius = this.board.layout.cellSize / 4
      ctx.beginPath()
      ctx.arc(coordinates.x, coordinates.y, radius, 0, 2 * Math.PI)
      if (this.config.hit) {
        ctx.strokeStyle = 'red'
        ctx.stroke()
      }
      if (this.config.isAim) {
        ctx.fillStyle = 'orange'
      } else {
        ctx.fillStyle = this.config.colour
      }
      ctx.fill()
    }
  }
}
</script>
