<template>
  <div>
    <h1 v-if="isWaitingForJoin">
      Waiting for someone to Join...
    </h1>

    <h1 v-if="isPlaying && yourMove" @click="showPlayerNameModal = true">
      Your Move {{ viewModel.yourName }}
    </h1>
    <h1 v-if="isPlaying && !yourMove">
      {{ viewModel.opponentName }}'s Move
    </h1>

    <div v-if="!viewModel.yourReady" @click="showPlayerNameModal = true">
      <h1>
        Get Ready {{ viewModel.yourName }}
      </h1>
      <h2>Position your ships for battle</h2>
    </div>
    <div v-if="viewModel.yourReady && isWaitingForReady">
      <h1>
        Almost There...
      </h1>
      <h2>Just waiting for {{ viewModel.opponentName }} to get ready...</h2>
    </div>

    <div v-if="isPlaying" class="player-strip">
      <player-switch class="player-strip__switcher" player1-name="YOUR FLEET" :player2-name="viewModel.opponentName" @change="handlePlayerSwitch" />
      <!-- <damage-report v-if="activeBoard" :damage="activeBoard.damage" /> -->
    </div>
    <battle-field
      v-if="activeBoard"
      v-slot="slotparams"
      :board="activeBoard"
      :cursor="cursor"
      :redraw="redrawBattlefield"
      @cellSelected="handleCellSelect"
      @drag="handleDrag"
      @dragDrop="handleDragDrop"
    >
      <battle-ship
        v-for="(ship, index) in activeBoard.battleships.filter( b => b.location)"
        :key="ship.id"
        :board="activeBoard"
        :canvas-context="slotparams.context"
        :config="{ id: ship.id, location: ship.location, length: ship.length, colour: ship.type.colour, vertical: ship.vertical }"
        :selected="ship.selected"
        :moving="ship.selected && isDragging"
        :redraw="redrawShip[index]"
      />
      <missile-peg
        v-for="(shot, index) in activeBoard.shots"
        :key="shot.id"
        :board="activeBoard"
        :canvas-context="slotparams.context"
        :config="{ id: shot.id, colour: shot.colour, location: shot.location, hit: shot.hit, isAim: shot.isAim }"
        :redraw="redrawShot[index]"
      />
    </battle-field>

    <div class="messages">
      <div v-if="isWaitingForJoin">
        <base-button @click.native="handleInvite">
          Invite a friend...
        </base-button>
        <p>battle against a friend (or enemy!)</p>
      </div>
      <div v-if="!viewModel.yourReady && !isWaitingForJoin">
        <base-button @click.native="declareReady">
          Let's Go!
        </base-button>
      </div>
      <base-button v-if="activeBoard === viewModel.opponentBoard && yourMove" :show-spinner="showFireSpinner" :is-destructive="true" @click.native="handleShoot">
        Fire!
      </base-button>
    </div>
    <!-- Modals -->
    <modal-dialog v-if="showModal" :actions="errorModalActions" @close="showModal = false">
      {{ modalMessage }}
    </modal-dialog>
    <modal-dialog
      v-if="showInviteModal"
      title="Invite a friend"
      :actions="inviteModalActions"
      @close="showInviteModal = false"
    >
      <p>
        Copy and share link to play with a friend!
      </p>
      <input type="text" class="urlInput" :value="shareUrl">
    </modal-dialog>
    <player-name-modal v-if="showPlayerNameModal" @nameChanged="sendNameChangeMessage" @close="showPlayerNameModal = false" />
    <pop-up v-if="showPopup" :message="hitMessage" @close="showPopup = false" />
  </div>
</template>

<script>

import { uuid } from 'uuidv4'

// Components
import BattleField from '../../components/BattleField.vue'
import MissilePeg from '../../components/MissilePeg.vue'
import BattleShip from '../../components/BattleShip.vue'
import PlayerSwitch from '../../components/PlayerSwitch.vue'
import PlayerNameModal from '../../components/PlayerNameModal.vue'
import BaseButton from '../../components/BaseButton.vue'
import ModalDialog from '../../components/ModalDialog.vue'
import PopUp from '../../components/PopUp.vue'

// Store
import { useUserStore } from '../../store/userStore'

// Services
import { joinGame, getGameData, addOrUpdateGameData } from '../../scripts/services/gameService'
import { attachMessageListener, send } from '../../scripts/services/messageService'
import { getDefaultBattleships } from '../../scripts/services/battleshipService'

// Utilities
import { copyTextToClipboard } from '../../scripts/copyToClipboard'

// Types
import { Shot } from '../../scripts/Shot'
import { MessageData } from '../../scripts/dataEntities/messageData'
import { Board } from '../../scripts/board'
import { GameData } from '../../scripts/dataEntities/gameData'
import { getPlayerData } from '../../scripts/services/playerService'

export default {
  name: 'PlayGame',
  components: { BattleField, MissilePeg, BattleShip, ModalDialog, BaseButton, PlayerSwitch, PlayerNameModal, PopUp },
  setup () {
    const store = useUserStore()
    return {
      store
    }
  },
  data () {
    const vm = this
    return {
      viewModel: {},
      activeBoard: null,
      selectedBattleship: null,
      isDragging: false,
      // currentPlayer: 1,
      redrawBattlefield: 0,
      redrawShip: [],
      redrawShot: [],
      cursor: 'default',
      isValid: true,
      showModal: false,
      showInviteModal: false,
      modalMessage: '',
      showInviteBlock: false,
      hitMessage: '',
      isSettingUp: true,
      showFireSpinner: false,
      showPlayerNameModal: true,
      isWaitingForJoin: true,
      isWaitingForReady: true,
      unsubscribeListener: [],
      showPopup: false,
      errorModalActions: [
        {
          id: 0,
          title: 'Close',
          isCloseAction: true,
          handler: () => {
            vm.showModal = false
            vm.$router.push('/')
          }
        }
      ],
      inviteModalActions: [
        {
          id: 0,
          title: 'Cancel',
          isSecondary: true,
          handle: () => {
            vm.showInviteModal = false
          }
        },
        {
          id: 1,
          title: 'Copy',
          confirmationMessage: 'copied',
          handle: () => {
            copyTextToClipboard(this.shareUrl)
            return true
          }
        }
      ]
    }
  },
  computed: {
    /**
     * Need to do this as templates can't see global types not defined in the vue instance
     */
    yourMove () {
      return this.viewModel && this.viewModel.currentPlayerId === this.userId
    },
    // GameState () {
    //   return GameState
    // },
    shareUrl () {
      return `${window.location.origin}/play/${this.gameId}`
    },
    gameId () {
      const code = this.$route.params.slug
      if (code) {
        return code.toUpperCase()
      }
      return ''
    },
    userId () {
      return this.store.user.uid
    },
    isPlaying () {
      return !this.isWaitingForJoin && !this.isWaitingForReady && this.viewModel.yourReady
    }
  },
  watch: {
    'store.playerName' (newVal) {
      this.viewModel.yourName = newVal
    },
    isPlaying () {
      if (this.isPlaying) {
        if (this.viewModel.isOwner) {
          // show the opponents board to let you fire first
          this.handlePlayerSwitch(2)
        } else {
          this.handlePlayerSwitch(1)
        }
      }
    }
  },
  mounted () {
    const vm = this

    this.attachListeners()
    this.isSettingUp = true
    this.isWaitingForJoin = true
    this.isWaitingForReady = true

    vm.retrieveGameData().then((gameData) => {
      // define the viewModel from the gameData
      vm.getViewModel(gameData).then((viewModel) => {
        vm.viewModel = viewModel

        if (!gameData.opponentId) {
          // check whether the current user is trying to join
          if (!vm.viewModel.isOwner) {
            // This is someone wanting to join a game
            vm.isWaitingForJoin = false
            vm.joinGame(gameData, vm.userId, vm.store.playerName)
          } else {
            // This is the owner loading their own game, still waiting for an opponent
            vm.isWaitingForJoin = true
          }
        } else if (!gameData.playerExists(this.userId)) {
          // Someone is trying to play an existing game that has players
          vm.displayError('Sorry, but you can\'t join this game')
        } else {
          // This will occur when users reload their pages - they'll lose their game state
          // but can keep playing
          vm.isWaitingForJoin = false
        }

        // Show your own board to let you position your battleships
        vm.handlePlayerSwitch(1)
        vm.redraw(vm.viewModel.yourBoard)
      })
    })
  },

  /**
   * Called when the page unmounts.
   */
  unmounted () {
    this.unsubscribe()
  },

  methods: {

    /**
     * Retrieve the gameData from the store. If no game exists one is created
     */
    async retrieveGameData () {
      // retrieve the game from the store (or create new)
      let gameData = await getGameData(this.gameId)
      if (!gameData) {
        gameData = new GameData({ id: this.gameId, boardSize: 10, ownerId: this.userId })
        // save to data store, don't need to wait for result
        addOrUpdateGameData(gameData)
      }
      return gameData
    },

    /**
     * Unsubscribe all message listeners
     */
    unsubscribe () {
      this.unsubscribeListener.forEach((unsubscribe) => {
        unsubscribe()
      })
    },

    /**
     * Called when the current user is ready
     */
    declareReady () {
      // mark yourself as ready
      this.viewModel.yourReady = true

      // let the opponent know you're ready
      send(new MessageData(
        {
          gameId: this.gameId,
          forUserId: this.viewModel.opponentId,
          messageType: 'ready',
          data: {
            userId: this.userId
          }
        }),
      { deleteOnReceive: true }
      )
    },

    /**
     * Called when your opponent is ready
     */
    handleReady () {
      // no loner waiting for someone to accept invite
      this.isWaitingForReady = false

      // mark your opponent as ready
      this.viewModel.opponentReady = true
    },

    /**
     * Attach message listeners to receive join and hit and shot events
     */
    attachListeners () {
      const vm = this

      // Will fire when opponent shoots at you
      this.unsubscribeListener.push(attachMessageListener(this.userId, this.gameId, 'shot', (message) => {
        vm.handleShotReceived(message.data)
      }))

      // Will fire when a shot you fire is received by the opponent
      this.unsubscribeListener.push(attachMessageListener(this.userId, this.gameId, 'shotLanded', (message) => {
        vm.handleShotLanded(message.data)
      }))

      // Listen for a player to join the game
      this.unsubscribeListener.push(attachMessageListener(this.userId, this.gameId, 'joined', (message) => {
        vm.handleJoin(message.data)
      }))

      this.unsubscribeListener.push(attachMessageListener(this.userId, this.gameId, 'ready', (message) => {
        vm.handleReady(message.data)
      }))

      this.unsubscribeListener.push(attachMessageListener(this.userId, this.gameId, 'nameChange', (message) => {
        vm.handleNameChange(message.data)
      }))
    },

    /**
     * Toggles the current player between the owner and opponenent.
     */
    swapTurns () {
      if (this.viewModel.currentPlayerId === this.viewModel.yourId) {
        this.viewModel.currentPlayerId = this.viewModel.opponentId
      } else {
        this.viewModel.currentPlayerId = this.viewModel.yourId
      }
    },

    /**
     * Called when an opponent changes their name
     */
    handleNameChange (message) {
      this.viewModel.opponentName = message.name
    },

    /**
     * Sends a message to your opponent with your updated name
     * @param {*} name
     */
    sendNameChangeMessage (name) {
      send(new MessageData({
        gameId: this.gameId,
        forUserId: this.viewModel.opponentId,
        messageType: 'nameChange',
        data: {
          name
        }
      }))
    },

    /**
     * Called when a user joins your game
     *
     * @param {*} joinData
     */
    handleJoin (joinData) {
      this.viewModel.opponentId = joinData.userId
      this.viewModel.opponentName = joinData.name
      this.viewModel.opponentReady = false
      this.isWaitingForJoin = false
    },

    /**
     * Called when your opponent fires at you
     *
     * @param {*} shot
     */
    handleShotReceived (shot) {
      console.log('shot received')
      if (this.viewModel.yourBoard) {
        // Check if hit
        const battleship = this.viewModel.yourBoard.battleshipAt(shot.location)
        if (battleship) {
          shot.hit = true
          shot.battleshipName = battleship.name
          shot.colour = 'red'
          this.viewModel.yourBoard.recordDamage(shot.battleshipName)

          // let the opponenet know their shot landed and was a hit
          send(new MessageData({
            gameId: this.gameId,
            forUserId: this.viewModel.opponentId,
            messageType: 'shotLanded',
            data: {
              shotId: shot.shotId,
              hit: true,
              colour: battleship.type.colour,
              battleshipName: battleship.type.name
            }
          }),
          { deleteOnReceive: true })
        } else {
          shot.colour = 'white'
          // let the opponenet know their shot landed and was a miss
          send(new MessageData({
            gameId: this.gameId,
            forUserId: this.viewModel.opponentId,
            messageType: 'shotLanded',
            data: {
              shotId: shot.shotId,
              colour: 'white',
              hit: false
            }
          }),
          { deleteOnReceive: true })
        }
        // update the shot on the board to reflect the shot (hit or not)
        this.viewModel.yourBoard.shots.push(shot)

        // Hand over your turn to the other player
        this.swapTurns()
      }
    },

    /**
     * Called when a shot you fired lands - hit or miss
     *
     * @param {*} hitData
     */
    handleShotLanded (shot) {
      if (this.viewModel.opponentBoard) {
        const index = this.viewModel.opponentBoard.shots.findIndex((s) => { return s.id === shot.shotId })
        if (index >= 0) {
          this.viewModel.opponentBoard.shots[index].hit = shot.hit
          this.viewModel.opponentBoard.shots[index].colour = shot.colour
          this.viewModel.opponentBoard.shots[index].battleshipName = shot.battleshipName
          if (shot.hit) {
            this.hitMessage = 'Hit! ' + shot.battleshipName + '.'
          } else {
            this.hitMessage = 'Missed!'
          }
          this.redrawShot[index] = Math.random()
          this.showPopup = true
        }
      }
    },

    /**
     * Switch the user interface to show the specified player's board.
     * @param {*} player a flag that represents the current player. 1 means your own board, 2 means your
     * opponent's board.
     */
    handlePlayerSwitch (player) {
      if (player === 1) {
        this.activeBoard = this.viewModel.yourBoard
      } else {
        this.activeBoard = this.viewModel.opponentBoard
      }
      this.damage = this.activeBoard.damage
      this.redraw(this.activeBoard)
    },

    /**
     * Handles when a user clicks on the enemies board, to show an orange aim marker.
     * Doesn't actually take the shot, this is handles when the handleShoot method is called.
     */
    handleShootAim (location) {
      // remove any previous aims - should only be one
      const shots = this.viewModel.opponentBoard.shots
      for (let i = 0; i < shots.length; i++) {
        if (shots[i].isAim) {
          shots.splice(i, 1)
        }
      }
      // add a shot to the board, marked as isAim so it can be rendered differently
      shots.push(new Shot({
        id: uuid(),
        location,
        isAim: true
      }))

      this.redraw(this.viewModel.opponentBoard)
    },

    /**
     * Handles when a user clicks to fire a shot
     */
    async handleShoot () {
      // Simulate a delay
      this.hitMessage = ''
      this.showFireSpinner = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.showFireSpinner = false

      // Hand the turn over to the opponent
      this.swapTurns()

      // get the aim shot
      const shots = this.viewModel.opponentBoard.shots
      const shot = shots.find((s) => { return s.isAim })

      if (shot) {
        // mark as a real shot
        shot.isAim = false

        // let the opponent know you shot at them
        send(new MessageData({
          gameId: this.gameId,
          forUserId: this.viewModel.opponentId,
          messageType: 'shot',
          data: {
            shotId: shot.id,
            location: shot.location
          }
        }), { deleteOnReceive: true })
      }
    },

    handleInvite () {
      this.showInviteModal = true
    },

    /**
     * Creates a new game record in the data store and refreshes the ViewModel
     */
    async handleNewGame () {
      const gameData = new GameData({ id: this.gameId, boardSize: 10, ownerId: this.userId })
      return await addOrUpdateGameData(gameData)
    },

    /**
     * Called when you want to join someone else's game
     *
     * @param {*} gameData
     * @param {*} userId user id of the user joining
     * @param {*} name name of the user joining
     * returns Promise
     */
    async joinGame (gameData, userId, name) {
      // add the user to the game
      await joinGame(gameData.id, userId)

      // let the owner know you joined
      send(new MessageData({
        gameId: gameData.id,
        forUserId: gameData.ownerId,
        messageType: 'joined',
        data: {
          userId,
          name
        }
      }), { deleteOnReceive: true })
    },

    /**
     * This method refreshes the game data used in the component. All state is lost.
     *
     * @param {*} gameData
     */
    async getViewModel (gameData) {
      // get some default battleships and postions
      const battleships = getDefaultBattleships()

      // Find the other players name
      const isOwner = this.store.user.uid === gameData.ownerId

      const opponentId = isOwner ? gameData.opponentId : gameData.ownerId
      let opponentPlayer = null
      if (opponentId) {
        opponentPlayer = await getPlayerData(opponentId)
      }

      return {
        gameCode: gameData.id,
        isOwner,
        yourId: this.store.user.uid,
        yourName: this.store.playerName,
        yourReady: false,
        yourBoard: new Board({
          battleships,
          size: gameData.boardSize,
          shots: []
        }),

        opponentId: opponentPlayer ? opponentPlayer.id : null,
        opponentName: opponentPlayer ? opponentPlayer.name : null,
        opponentReady: false,
        opponentBoard: new Board({
          battleships: [],
          size: gameData.boardSize,
          shots: []
        }),

        currentPlayerId: gameData.ownerId
      }
    },

    // handleBattleshipsReady () {
    //   // Save the battleships
    //   this.interactor.addBattleships(this.gameId, this.userId, this.viewModel.yourBoard.battleships)
    // },

    displayError (error) {
      this.modalMessage = error
      this.modalIsFatal = true
      this.showModal = true
    },
    // redrawBattleship (board, battleship) {
    //   const index = board.battleships.findIndex(b => b.id === battleship.id)
    //   if (index) {
    //     this.redrawShip[index] = Math.random()
    //   }
    // },
    redraw (board) {
      if (!board) { return }

      // this will for the grid to redraw
      this.redrawBattlefield = Math.random()

      // Refresh battleships if there are any (typically only your own board)
      if (board.battleships) {
        if (this.redrawShip.length !== board.battleships.length) {
          this.redrawShip = board.battleships.map(() => 0)
        }
        this.redrawShip = this.redrawShip.map(r => Math.random())
      }

      // Refresh shots if there any on the board
      if (board.shots) {
        if (this.redrawShot.length !== board.shots.length) {
          this.redrawShot = board.shots.map(() => 0)
        }
        this.redrawShot = this.redrawShot.map(r => Math.random())
      }

      // recalculate valid board
      this.isValid = board.isValid
    },

    handleCellSelect (gridRef) {
      if (this.activeBoard === this.viewModel.opponentBoard && this.yourMove) {
        this.handleShootAim(gridRef)
      } else if (this.settingUp) {
        const clickedBattleship = this.viewModel.yourBoard.battleshipAt(gridRef)
        if (this.selectedBattleship) {
          console.log('Selected Battleship Exists')
          // Clicked same battleship
          if (clickedBattleship === this.selectedBattleship) {
            console.log('You Clicked The Selected Battleship')
            // Rotate?
            if (clickedBattleship.cellForRotate.row === gridRef.row && clickedBattleship.cellForRotate.column === gridRef.column) {
              console.log('You Rotated The Selected Battleship')
              this.selectedBattleship.rotate()
              this.redraw(this.viewModel.yourBoard)
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

        this.redraw(this.viewModel.yourBoard)
      }
    },

    handleDrag (drag) {
      if (this.activeBoard === this.viewModel.yourBoard && this.isSettingUp) {
        // see if we are dragging a battleship
        const dragBattleship = this.viewModel.yourBoard.battleshipAt(drag.from)
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
        this.viewModel.yourBoard.size)
        this.redraw(this.viewModel.yourBoard)
      }
    },

    handleDragDrop (gridRef) {
      if (this.activeBoard === this.viewModel.yourBoard) {
        if (this.selectedBattleship) {
          this.selectedBattleship.selected = true
        } else {
          this.selectedBattleship = null
        }
        this.isDragging = false
        this.redraw(this.viewModel.yourBoard)
      }
    }
  }
}
</script>

<style scoped>

h1 {
  margin-top: 0px;
}
.player-strip {
  margin-top: 20px;
  /* display: grid; */
  /* grid-template-columns: repeat(2, 1fr); */
  justify-content: center;
  align-items: center;
  color:white;
  width: 100%;
  min-height: 50px;
  padding: 10px;
  box-sizing: border-box;
}
.player-strip__switcher {
  /* grid-column: 1 / 3; */
  width: 100%;
  margin-bottom: 20px;
}
.messages {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color:white;
  width: 100%;
  min-height: 100px;
  padding: 10px;
  box-sizing: border-box;
}

.urlInput {
-webkit-appearance: none;
  height: 30px;
  width: 100%;
  min-width: 300px;
  border-radius: 5px;
  background: var(--bs-lightgrey);
  cursor: text;
  text-overflow: ellipsis;
  box-sizing: border-box;
  border: 0;
  padding: 15px;
  font-size: var(--bs-font-normal);
}

user agent stylesheet input[type="text" i] {
  padding: 1px 2px;
}
</style>
