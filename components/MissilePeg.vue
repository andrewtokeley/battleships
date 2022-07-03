<template>
  <div />
</template>

<script>

export default {
  name: 'MissilePeg',
  props: {
    canvasContext: null,
    board: null,
    // canvasContext: {
    //   type: Object,
    //   default: null
    // },
    // layout: {
    //   type: Object,
    //   default: null
    // },
    row: {
      type: Number,
      default: 1
    },
    column: {
      type: Number,
      default: 1
    },
    hit: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.draw(this.canvasContext)

    // this.attachListeners()
  },
  methods: {
    draw (ctx) {
      const coordinates = this.layout.coordinatesAt(this.row, this.column, true)
      const radius = this.board.layout.cellSize / 4
      ctx.beginPath()
      ctx.arc(coordinates.x, coordinates.y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = this.hit ? 'red' : 'white'
      ctx.fill()
    }
  }
}
</script>
