<template>
  <div>
    <loading-spinner
      v-if="!activeBoard"
      class="loading-spinner"
      :size="50"
      :border-size="7"
      message="creating game..."
    />
    <div v-else>
      <div class="menuIcon">
        <icon :options="menuIconOptions" @menuClick="handleMenuClick">
          menu
        </icon>
      </div>
      <h1 v-if="isGameOver">
        Game Over! {{ winnerName }} won!
      </h1>

      <h1 v-if="isWaitingForJoin && viewModel.yourReady">
        Waiting for someone to Join...
      </h1>

      <h1 v-if="isPlaying && yourMove" @click="showPlayerNameModal = true">
        Your Move <span class="playerName" @click="showPlayerNameModal = true">{{ yourName }}</span>
      </h1>
      <h1 v-if="isPlaying && !yourMove">
        {{ viewModel.opponentName }}'s Move
      </h1>

      <h1 v-if="!isPlaying && !isGameOver">
        Get Ready <span class="playerName" @click="showPlayerNameModal = true">{{ yourName }}</span>
      </h1>
      <!-- <h1 v-else>
      {{ viewModel.opponentName }} vs <span class="playerName" @click="showPlayerNameModal = true">{{ yourName }}</span>
    </h1> -->

      <p v-if="!viewModel.yourReady" class="subHeading">
        Position your ships for battle
      </p>

      <p v-if="viewModel.yourReady && isWaitingForReady" class="subHeading">
        Just waiting for {{ viewModel.opponentName }} to get ready...
      </p>

      <div v-if="isPlaying || isGameOver" class="player-strip">
        <player-switch
          class="player-strip__switcher"
          player1-name="YOUR FLEET"
          :player2-name="viewModel.opponentName"
          :your-move="isGameOver ? null : yourMove"
          :your-hit-result="isGameOver ? null : yourHitResult"
          :initial-tab="tabOnLoad"
          @change="handlePlayerSwitch"
        />
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
        <battle-ship-component
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
        <base-button v-if="isWaitingForJoin" @click.native="handleInvite">
          Invite a friend...
        </base-button>

        <base-button v-if="!viewModel.yourReady && !isWaitingForJoin" @click.native="declareReady">
          Let's Go!
        </base-button>

        <p v-if="viewModel.opponentName && !viewModel.yourReady && !isWaitingForJoin">
          You're playing against {{ viewModel.opponentName }}
        </p>

        <base-button v-if="isGameOver" @click.native="$router.go()">
          Play Again?
        </base-button>

        <base-button v-if="activeBoard === viewModel.opponentBoard && yourMove" :show-spinner="showFireSpinner" :is-destructive="true" @click.native="handleShoot">
          Fire!
        </base-button>
      </div>
      <!-- Modals -->
      <modal-dialog v-if="showErrorModal" title="Yeah, about that" :actions="errorModalActions" @close="showErrorModal = false">
        {{ errorMessage }}
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
      <pop-up v-if="showPopup" :message="popupMessage" :sub-message="popupSubMessage" :sub-message-colour="popupSubMessageColour" @close="showPopup = false" />
    </div>
  </div>
  </div>
</template>

<script>

import { v4 as uuidv4 } from 'uuid'

// Components
import BattleField from '../../components/BattleField.vue'
import MissilePeg from '../../components/MissilePeg.vue'
import BattleShipComponent from '../../components/BattleShip.vue'
import PlayerSwitch from '../../components/PlayerSwitch.vue'
import PlayerNameModal from '../../components/PlayerNameModal.vue'
import BaseButton from '../../components/BaseButton.vue'
import ModalDialog from '../../components/ModalDialog.vue'
import PopUp from '../../components/PopUp.vue'

// Store
import { useUserStore } from '../../store/userStore'

// Services
import { joinGame, getGameData, addOrUpdateGameData, restartGame, deleteGame } from '../../scripts/services/gameService'
import { attachMessageListener, send } from '../../scripts/services/messageService'
import { getDefaultBattleships, addBattleships, getBattleships } from '../../scripts/services/battleshipService'
import { addOrUpdateShot, getShots } from '../../scripts/services/shotService'

// Utilities
import { copyTextToClipboard } from '../../scripts/copyToClipboard'
import { constants } from '../../scripts/constants'

// Types
import { Shot } from '../../scripts/Shot'
import { MessageData } from '../../scripts/dataEntities/messageData'
import { Board } from '../../scripts/board'
import { GameData } from '../../scripts/dataEntities/gameData'
import { getPlayerData } from '../../scripts/services/playerService'
import { Battleship } from '../../scripts/battleShip'
import { ShotData } from '../../scripts/dataEntities/shotData'
import { ErrorType } from '../../scripts/Types'

export default {
  name: 'PlayGame',
  components: { BattleField, MissilePeg, BattleShipComponent, ModalDialog, BaseButton, PlayerSwitch, PlayerNameModal, PopUp },
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
      isShooting: false,
      showErrorModal: false,
      showInviteModal: false,
      errorMessage: '',
      showInviteBlock: false,
      popupMessage: '',
      popupSubMessage: '',
      popupSubMessageColour: 'white',
      isSettingUp: true,
      showFireSpinner: false,
      showPlayerNameModal: false,
      isWaitingForJoin: true,
      isWaitingForReady: true,
      unsubscribeListener: [],
      showPopup: false,
      yourHitResult: null,
      tabOnLoad: 1,
      errorModalActions: [
        {
          id: 0,
          title: 'Close',
          // isCloseAction: true,
          handler: () => {
            vm.showErrorModal = false
            // vm.$router.push('/')
          }
        }
      ],
      inviteModalActions: [
        {
          id: 0,
          title: 'Cancel',
          isSecondary: true,
          handler: () => {
            vm.showInviteModal = false
          }
        },
        {
          id: 1,
          title: 'Copy',
          confirmationMessage: 'copied',
          handler: () => {
            copyTextToClipboard(this.shareUrl)
            return true
          }
        }
      ]
    }
  },
  computed: {
    menuIconOptions () {
      const options = { ...constants.ICON_OPTIONS.ON_DARK }
      options.isClickable = true
      options.menu = {
        rightAligned: false,
        menuItems: [
          { id: 0, name: 'Restart', iconName: 'refresh' },
          { id: 2, name: 'Quit', iconName: 'close' },
          { isDivider: true },
          { id: 3, name: 'v 1.2', isFullWidth: true, isLabel: true }
        ]
      }
      return options
    },
    yourName () {
      return this.store.playerName
    },
    // yourIndicatorColour () {
    //   const yourMove = this.viewModel.currentPlayerId === this.userId
    //   if (yourMove) {
    //     console.log('yourIndicator transparent')
    //     return 'transparent'
    //   } else {
    //     console.log('yourIndicator green')
    //     return 'green'
    //   }
    // },
    // opponentIndicatorColour () {
    //   const yourMove = this.viewModel.currentPlayerId === this.userId
    //   if (yourMove) {
    //     console.log('opponentIndicator green')
    //     return 'green'
    //   } else {
    //     console.log('opponentIndicator trans')
    //     return 'transparent'
    //   }
    // },

    winnerName () {
      if (!this.isGameOver) {
        return null
      }
      return (this.viewModel.yourHitTotal === this.viewModel.hitsForWin) ? this.yourName : this.viewModel.opponentName
    },

    isGameOver () {
      return this.viewModel.yourHitTotal === this.viewModel.hitsForWin || this.viewModel.opponentHitTotal === this.viewModel.hitsForWin
    },

    yourMove () {
      return this.viewModel && this.viewModel.currentPlayerId === this.userId
    },

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
      return !this.isGameOver && !this.isWaitingForJoin && !this.isWaitingForReady && this.viewModel.yourReady
    }

  },
  watch: {
    'store.playerName' (newVal) {
      this.yourName = newVal
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
    this.startGame(this.gameId)
  },

  /**
   * Called when the page unmounts.
   */
  unmounted () {
    this.unsubscribe()
  },

  methods: {
    startGame () {
      const vm = this
      vm.retrieveGameData().then(function (gameData) {
        if (gameData.canJoin(vm.userId)) {
          vm.attachListeners()
          vm.isSettingUp = true
          vm.isWaitingForJoin = true
          vm.isWaitingForReady = true

          // define the viewModel from the gameData
          vm.getViewModel(vm.userId, gameData).then((viewModel) => {
            vm.viewModel = viewModel
            if (vm.yourName.startsWith('Player')) {
              vm.showPlayerNameModal = true
            }

            if (!gameData.opponentId) {
            // check whether the current user is trying to join
              if (!vm.viewModel.isOwner) {
              // This is someone wanting to join someone else's game
                console.log('Wants to join game')
                // Can assume the owner has joined
                vm.isWaitingForJoin = false

                // Let the owner know you're joinging
                vm.joinGame(gameData, vm.userId, vm.store.playerName)
              } else {
              // This is the owner re-loading their own game and still waiting for an opponent
                console.log('Owner refreshing own game')
                vm.isWaitingForJoin = true
              }
            } else if (!gameData.playerExists(vm.userId)) {
            // Someone is trying to play an existing game that has players
              vm.displayError('Someone else has joined this game already.')
            } else {
            // Either the owner or opponent is re-loading the game

              // Regardless we need to know whether the other player is ready (we may have missed it)
              // Assume they're not ready, handling the ping response will update if they are
              if (vm.viewModel.isOwner) {
                console.log('Owner refreshing own game')
              } else {
                console.log('Refreshing game (not owner)')
              }
              vm.isWaitingForJoin = !vm.viewModel.opponentId
              vm.isWaitingForReady = !vm.viewModel.opponentReady
              vm.ping()
            }

            // Show your own board to let you position your battleships
            vm.handlePlayerSwitch(1)

            vm.tabOnLoad = vm.yourMove ? 2 : 1

            vm.redraw(vm.viewModel.yourBoard)
          })
        } else {
          // can't play someone else has joined this game
          vm.$router.push({ path: '/', query: { error: ErrorType.GameFull.code } })
        }
      })
    },

    restartGame () {
      const vm = this
      // call the service to restart game, this will load the battleships and shots
      restartGame(this.gameId).then(() => {
        vm.startGame(vm.gameId)
        alert('Done')
      })
    },

    /**
     *
     */
    handleMenuClick (menuItem) {
      switch (menuItem.id) {
        case 0:
          // Restart
          this.restartGame()
          break
        case 1:
          alert('delete')
          break
        case 2:
          this.quitGame()
          break
        default:
      }
    },

    quitGame () {
      const vm = this
      deleteGame(this.gameId).then(() => {
        vm.$router.push('/')
      })
    },

    /**
     * Checks for a winner and returns true if there is one, otherwise false
     */
    checkForWinner () {
      if (this.isGameOver) {
        this.popupMessage = `${this.winnerName} won!`
        this.popupSubMessage = ''
        this.showPopup = true
        return true
      }
      return false
    },

    /**
     * What colour should the indicator be on the player switch for the give player (1 is you, 2 in opponent)
     * @param {*} playerNumber
     */
    indicatorColour (playerNumber) {
      // Your indicator
      if (playerNumber === 1) {
        if (this.yourMove) {
          return 'transparent'
        } else {
          return 'green'
        }
      }

      // Opponent's indicator
      if (playerNumber === 2) {
        if (!this.yourMove) {
          return 'transparent'
        } else {
          return 'green'
        }
      }
    },

    /**
     * Retrieve the gameData from the store. If no game exists one is created
     */
    async retrieveGameData () {
      // retrieve the game from the store
      const gameData = await getGameData(this.gameId)
      if (!gameData) {
        this.$router.push({ path: '/', query: { error: ErrorType.GameDoesNotExist.code } })
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
      // delselect any battleships you were working with
      if (this.selectedBattleship) {
        this.selectedBattleship.selected = false
      }

      if (!this.viewModel.yourBoard.isValid) {
        this.displayError('Your battleships are not allowed to be postioned like this, buddy. They must not overlap or be outside the grid.')
      } else {
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

        // save you battleships to data store
        const battleshipData = this.viewModel.yourBoard.battleships.map(b => b.toBattleshipData(this.gameId, this.userId))
        addBattleships(battleshipData)

        // if you're revisiting the game and have already a message that the opponent was ready, then
        // the waiting is over and it's game on
        if (this.viewModel.opponentReady) {
          console.log('re joining and not waiting')
          this.isWaitingForReady = false
        }
      }
    },

    /**
     * Called when your opponent is ready
     */
    handleReady (options = {}) {
      console.log('handleReady')
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

      this.unsubscribeListener.push(attachMessageListener(this.userId, this.gameId, 'ping', () => {
        vm.handlePing()
      }))
    },

    /**
     * See if your opponent is ready (they may have sent a ready message that you missed)
     */
    ping () {
      send(new MessageData({
        gameId: this.gameId,
        forUserId: this.viewModel.opponentId,
        messageType: 'ping'
      }))
    },

    /**
     * Toggles the current player between the owner and opponenent.
     */
    swapTurns () {
      if (this.viewModel.currentPlayerId === this.userId) {
        this.viewModel.currentPlayerId = this.viewModel.opponentId
      } else {
        this.viewModel.currentPlayerId = this.userId
      }
    },

    /**
     * Called when a user pings to see if you're ready to play
     * @param {*} data
     */
    handlePing () {
      console.log('Received Ping')
      // if (this.viewModel.yourReady) {
      //   console.log('Re-declaring ready')
      //   this.declareReady()
      // } else {
      //   // received a ping but not ready
      // }
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
      // if (joinData.confirmReady) {
      //   if (this.viewModel.yourReady) {
      //     console.log('redeclaring ready')
      //     this.declareReady()
      //   }
      // }
      this.viewModel.opponentId = joinData.userId
      this.viewModel.opponentName = joinData.name
      this.viewModel.opponentReady = false
      this.isWaitingForJoin = false
    },

    /**
     * Called when your opponent fires at you. Parameter to this method contains shotId and location properties
     *
     * @param {*} shot
     */
    handleShotReceived (shot) {
      if (this.viewModel.yourBoard) {
        // Check if hit
        const battleship = this.viewModel.yourBoard.battleshipAt(shot.location)
        if (battleship) {
          // extend the shot object with more info about the shot
          shot.hit = true
          shot.battleshipName = battleship.name
          shot.colour = 'red'
          this.yourHitResult = true
          this.viewModel.yourBoard.recordDamage(shot.battleshipName)

          // let the opponenet know their shot landed and was a hit
          send(new MessageData({
            gameId: this.gameId,
            forUserId: this.viewModel.opponentId,
            messageType: 'shotLanded',
            data: {
              shotId: shot.shotId,
              location: shot.location,
              hit: true,
              colour: battleship.type.colour,
              battleshipName: battleship.type.name
            }
          }),
          { deleteOnReceive: true })

          this.viewModel.opponentHitTotal += 1
        } else {
          this.yourHitResult = false
          shot.colour = 'white'
          shot.hit = false
          // let the opponenet know their shot landed and was a miss
          send(new MessageData({
            gameId: this.gameId,
            forUserId: this.viewModel.opponentId,
            messageType: 'shotLanded',
            data: {
              shotId: shot.shotId,
              location: shot.location,
              colour: 'white',
              hit: false
            }
          }),
          { deleteOnReceive: true })
        }

        // update the shot on the board to reflect the shot (hit or not)
        this.viewModel.yourBoard.shots.push(shot)

        if (!this.checkForWinner()) {
          // Hand over your turn to the other player
          this.swapTurns()
        }
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

          // redraw to show change in hit status
          this.redrawShot[index] = Math.random()

          if (shot.hit) {
            this.viewModel.yourHitTotal += 1
            if (this.checkForWinner()) {
              return
            }
            this.popupMessage = 'Hit!'
            this.popupSubMessage = shot.battleshipName
            this.popupSubMessageColour = shot.colour
          } else {
            this.popupMessage = 'Missed!'
            this.popupSubMessage = ''
          }
          this.showPopup = true

          // add record to database. Add the user who fired the shot and gameId for context
          shot.gameId = this.gameId
          shot.playerId = this.userId
          addOrUpdateShot(ShotData.fromShot(shot))
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
      if (this.isShooting) {
        return
      }
      // remove any previous aims - should only be one
      const shots = this.viewModel.opponentBoard.shots
      for (let i = 0; i < shots.length; i++) {
        if (shots[i].isAim) {
          shots.splice(i, 1)
        }
      }
      // add a shot to the board, marked as isAim so it can be rendered differently
      shots.push(new Shot({
        id: uuidv4(),
        location,
        isAim: true
      }))

      this.redraw(this.viewModel.opponentBoard)
    },

    /**
     * Handles when a user clicks to fire a shot
     */
    handleShoot () {
      // don't let a user double fire
      if (this.isShooting) {
        return
      }

      const shots = this.viewModel.opponentBoard.shots
      const shot = shots.find((s) => { return s.isAim })

      // Don't let a user fire without selecting a shot
      if (!shot) {
        this.displayError('Click on the board to aim your shot before firing')
        this.showErrorModal = true
        return
      }

      // Simulate a delay
      this.isShooting = true
      this.popupMessage = ''
      this.yourHitResult = null
      this.showFireSpinner = true
      const wait = new Promise(resolve => setTimeout(resolve, 2000))
      wait.then(() => {
        this.showFireSpinner = false

        // Hand the turn over to the opponent
        this.swapTurns()
        this.isShooting = false

        // mark as a real shot
        shot.isAim = false

        // let the opponent know you shot at them
        console.log('shot')
        send(new MessageData({
          gameId: this.gameId,
          forUserId: this.viewModel.opponentId,
          messageType: 'shot',
          data: {
            shotId: shot.id,
            location: shot.location
          }
        }), { deleteOnReceive: true })
      })
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
     * @param {*} confirmReady if set to true the other player will resend the 'ready' message, to let this play
     * know what state the game is in.
     * returns Promise
     */
    async joinGame (gameData, userId, name, confirmReady = false) {
      // add the user to the game
      await joinGame(gameData.id, userId)

      // let the owner know you joined
      send(new MessageData({
        gameId: gameData.id,
        forUserId: gameData.ownerId,
        messageType: 'joined',
        data: {
          userId,
          name,
          confirmReady
        }
      }), { deleteOnReceive: true })
    },

    /**
     * This method refreshes the game data used in the component. All state is lost.
     *
     * @param {*} gameData
     */
    async getViewModel (userId, gameData) {
      console.log('getViewModel')
      // See if the user already saved battleshps (can happen if they are coming back to an unfinished game)
      let battleships = await getBattleships(gameData.id, userId)
      if (!battleships || battleships.length === 0) {
        // Otherwise get some default battleships and postions
        battleships = getDefaultBattleships()
      } else {
        battleships = battleships.map((b) => { return Battleship.fromBattleshipData(b) })
      }

      const isOwner = userId === gameData.ownerId
      const opponentId = isOwner ? gameData.opponentId : gameData.ownerId

      // Any shots fired?
      const yourShots = await getShots(gameData.id, userId)
      const yourReady = yourShots.length > 0

      // Ignore the colour of the shot for your opponent, always make hits red, misses white
      let opponentReady = false
      let opponentShots = []
      if (opponentId) {
        opponentShots = await getShots(gameData.id, opponentId)
        opponentShots = opponentShots.map((shot) => {
          if (shot.hit) {
            shot.colour = 'red'
          } else {
            shot.colour = 'white'
          }
          return shot
        })
        opponentReady = opponentShots.length > 0
      }

      // Find the other players name
      let opponentPlayer = null
      if (opponentId) {
        opponentPlayer = await getPlayerData(opponentId)
      }

      let currentPlayerId = gameData.ownerId
      if (opponentShots.length > 0 && opponentShots.length < yourShots.length) {
        currentPlayerId = opponentId
      }
      // console.log(currentPlayerId)

      return {
        hitsForWin: battleships.reduce((previousValue, currentValue) => previousValue + currentValue.length, 0),
        gameCode: gameData.id,
        isOwner,
        yourReady,
        yourHitTotal: 0,
        yourBoard: new Board({
          battleships,
          size: gameData.boardSize,
          shots: opponentShots
        }),

        opponentId: opponentPlayer ? opponentPlayer.id : null,
        opponentName: opponentPlayer ? opponentPlayer.name : null,
        opponentReady,
        opponentHitTotal: 0,
        opponentBoard: new Board({
          battleships: [],
          size: gameData.boardSize,
          shots: yourShots
        }),

        currentPlayerId
      }
    },

    // handleBattleshipsReady () {
    //   // Save the battleships
    //   this.interactor.addBattleships(this.gameId, this.userId, this.viewModel.yourBoard.battleships)
    // },

    displayError (error) {
      this.errorMessage = error
      this.showErrorModal = true
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
    },

    handleCellSelect (gridRef) {
      if (this.activeBoard === this.viewModel.opponentBoard && this.yourMove) {
        this.handleShootAim(gridRef)
      } else if (!this.viewModel.yourReady) {
        const clickedBattleship = this.viewModel.yourBoard.battleshipAt(gridRef)
        if (this.selectedBattleship) {
          console.log('Selected Battleship Exists')
          // Clicked same battleship
          if (clickedBattleship === this.selectedBattleship) {
            console.log('You Clicked The Selected Battleship')
            // Rotate?
            if (clickedBattleship.cellForRotate.row === gridRef.row && clickedBattleship.cellForRotate.column === gridRef.column) {
              console.log('You Rotated The Selected Battleship')
              this.selectedBattleship.rotate(this.viewModel.yourBoard.layout.gridSize)
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
      if (this.activeBoard === this.viewModel.yourBoard && !this.viewModel.yourReady) {
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
      if (this.activeBoard === this.viewModel.yourBoard && !this.viewModel.yourReady) {
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

.menuIcon {
  margin-left: 20px;
  float: left;
}

h1 {
  margin-top: 0px;
  clear: left;
}
p.subHeading {
  text-align: center;
  color: white;
}

.playerName {
  color:var(--bs-green);
  cursor: pointer;
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
