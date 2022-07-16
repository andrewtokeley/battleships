
/**
 * Structure to send and receive messages between players
 */
export class MessageData {
  /**
   * Construct a new instance of MessageData
   *
   * @param {*} config object containing
   * - gameId: the game within which you are sending a message
   * - forUserId: who the message is for
   * - messageType: the type of message being sent
   * - data: the data for the message
   */
  constructor (config) {
    this.id = config.id
    this.gameId = config.gameId
    this.forUserId = config.forUserId
    this.messageType = config.messageType
    this.data = config.data
    this.deleteOnReceive = config.deleteOnReceive
  }
}

/**
 * DataConverter for MessageData instances
 */
export const MessageDataConverter = {
  toFirestore (data) {
    const result = {}
    if (data.gameId) { result.gameId = data.gameId }
    if (data.playerId) { result.playerId = data.playerId }
    if (data.forUserId) { result.forUserId = data.forUserId }
    if (data.messageType) { result.messageType = data.messageType }
    if (data.data) { result.data = data.data }
    if (data.deleteOnReceive) { result.deleteOnReceive = data.deleteOnReceive }
    return result
  },

  fromFirestore (snapshot, options) {
    const data = snapshot.data(options)
    const config = {
      id: snapshot.id,
      gameId: data.gameId,
      forUserId: data.forUser,
      messageType: data.messageType,
      deleteOnReceive: data.deleteOnReceive,
      data: data.data
    }

    return new MessageData(config)
  }
}
