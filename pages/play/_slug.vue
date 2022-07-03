<template>
  <div>
    <h1>PLAY</h1>
    <h2>{{ userId }}</h2>
    <battle-field
      v-if="viewModel.board"
      v-slot="slotparams"
      :board="viewModel.board"
      :cursor="cursor"
      :redraw="redrawBattlefield"
      @cellSelected="handleCellSelect"
      @drag="handleDrag"
      @dragDrop="handleDragDrop"
    >
      <battle-ship
        v-for="(ship, index) in viewModel.board.battleships"
        :key="ship.id"
        :board="viewModel.board"
        :canvas-context="slotparams.context"
        :config="{ id: ship.id, location: ship.location, length: ship.length, colour: ship.colour, vertical: ship.vertical }"
        :selected="ship.selected"
        :moving="ship.selected && isDragging"
        :redraw="redrawShip[index]"
      />
      <missile-peg
        v-for="missile in viewModel.board.shotsTaken"
        :key="missile.id"
        :board="viewModel.board"
        :canvas-context="slotparams.context"
        :location="missile.location"
        :hit="missile.hit"
      />
    </battle-field>
  </div>
</template>

<script>

// Components
import BattleField from '../../components/BattleField.vue'
import MissilePeg from '../../components/MissilePeg.vue'
import BattleShip from '../../components/BattleShip.vue'

// Interactor
import { PlayGameInteractor } from '../../scripts/interators/playGameInteractor'

// Store
import { useUserStore } from '../../store/userStore'

export default {
  name: 'PlayGame',
  components: { BattleField, MissilePeg, BattleShip },
  setup () {
    const store = useUserStore()
    return {
      store
    }
  },
  data () {
    return {
      viewModel: Object,
      interactor: PlayGameInteractor,
      selectedBattleship: null,
      isDragging: false,
      redrawBattlefield: 0,
      redrawShip: [],
      redrawShipAll: 0,
      cursor: 'default',
      isValid: true
    }
  },
  computed: {
    gameId () {
      return this.$route.params.slug
    },
    userId () {
      return this.store.user.uid
    }
  },
  mounted () {
    // Get the ViewModel this component needs
    this.interactor = new PlayGameInteractor()

    const vm = this
    this.interactor.getGame(this.gameId, this.userId)
      .then(function (result) {
        vm.viewModel = result
        vm.viewModel.board.battleships.forEach((b) => {
          vm.redrawBattleship(b)
        })
      }).catch(function (e) {
        console.error(e)
      })
  },
  methods: {

    redrawBattleship (battleship) {
      const index = this.viewModel.board.battleships.findIndex(b => b.id === battleship.id)
      if (index) {
        this.redrawShip[index] = Math.random()
      }
    },
    redraw () {
      this.redrawBattlefield = Math.random()
      this.redrawShip = this.redrawShip.map(r => Math.random())

      // recalculate valid board
      this.isValid = this.viewModel.board.isValid
    },

    handleCellSelect (gridRef) {
      const clickedBattleship = this.viewModel.board.battleshipAt(gridRef)
      if (this.selectedBattleship) {
        console.log('Selected Battleship Exists')
        // Clicked same battleship
        if (clickedBattleship === this.selectedBattleship) {
          console.log('You Clicked The Selected Battleship')
          // Rotate?
          if (clickedBattleship.cellForRotate.row === gridRef.row && clickedBattleship.cellForRotate.column === gridRef.column) {
            console.log('You Rotated The Selected Battleship')
            this.selectedBattleship.rotate()
            // this.redraw()
          }
          // return
        } else if (clickedBattleship != null) {
          console.log('You Clicked on Another Battleship')
          // Clicked on another battleship
          this.selectedBattleship.selected = false
          this.selectedBattleship = clickedBattleship
          this.selectedBattleship.selected = true
        } else {
          console.log('You Clicked in the Sea')
          // Selected nothing
          this.selectedBattleship.selected = false
          this.selectedBattleship = null
        }
        // Click something new
      } else if (clickedBattleship) {
        console.log('No Selected BattleShip')
        console.log('Selected New BattleShip')
        this.selectedBattleship = clickedBattleship
        this.selectedBattleship.selected = true
      } else {
        console.log('No Selected BattleShip')
        console.log('You Clicked in thre Sea')
      }

      this.redraw()
    },

    handleDrag (drag) {
      // see if we are dragging a battleship
      const dragBattleship = this.viewModel.board.battleshipAt(drag.from)
      if (!dragBattleship) {
        return
      }

      // If this is the first drag movement and another battleship is selected, unselect it
      if (!this.isDragging && this.selectedBattleship && this.selectedBattleship !== dragBattleship) {
        console.log('You Dragged a New Battleship')
        this.selectedBattleship.selected = false
      }

      this.isDragging = true

      // Make sure the current battleship is updated to the one being dragged
      this.selectedBattleship = dragBattleship
      console.log('Moving Battleship')
      this.selectedBattleship.moveBy({
        row: drag.to.row - drag.from.row,
        column: drag.to.column - drag.from.column
      },
      this.viewModel.board.size)
      this.redraw()
    },

    handleDragDrop (gridRef) {
      if (this.selectedBattleship) {
        this.selectedBattleship.selected = true
      } else {
        this.selectedBattleship = null
      }
      this.isDragging = false
      this.redraw()
    }
  }
}
</script>
