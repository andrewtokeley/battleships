<template>
  <div>
    <div class="messages">
      <h2>
        {{ gameId }}
        <icon>content_copy</icon>
      </h2>
      <p v-if="settingUp">
        Position your battleships
      </p>
    </div>
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
    <modal-dialog v-if="showModal" @close="showModal = false">
      {{ modalMessage }}
    </modal-dialog>
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
import ModalDialog from '../../components/ModalDialog.vue'
import Icon from '../../components/Icon.vue'

export default {
  name: 'PlayGame',
  components: { BattleField, MissilePeg, BattleShip, ModalDialog, Icon },
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
      isValid: true,
      showModal: false,
      modalMessage: '',
      settingUp: true

    }
  },
  computed: {
    gameId () {
      const code = this.$route.params.slug
      if (code) {
        return code.toUpperCase()
      }
      return ''
    },
    userId () {
      return this.store.user.uid
    }
  },
  async mounted () {
    const vm = this
    // Get the ViewModel this component needs to render
    this.interactor = new PlayGameInteractor()

    // the will create a new game if none exist with the code
    this.game = await this.interactor.getGame(this.gameId)
    if (!this.game) {
      this.modalMessage = 'Game does not exist'
      this.showModal = true
      return
    }
    // make sure the current user's id is set against the game
    this.interactor.addPlayerToGame(this.gameId, this.userId).then(() => {
      vm.interactor.getGameViewModel(this.gameId, this.userId).then((result) => {
        vm.viewModel = result
        vm.redraw()
      })
    }).catch((error) => {
      // edge case, probably game full or game doesn't exist
      console.error(error)
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
      if (this.redrawShip.length !== this.viewModel.board.battleships.length) {
        this.redrawShip = this.viewModel.board.battleships.map(() => 0)
      }
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
            this.redraw()
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

<style scoped>

.messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  color:white;
  width: 100%;
  height: 200px;
}
</style>
