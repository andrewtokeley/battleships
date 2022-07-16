
class Shot {
  constructor (config) {
    this.id = config.id
    this.location = config.location
    this.hit = config.hit
    this.isAim = config.isAim
  }

  static fromShotData (data) {
    return new Shot({
      id: data.id,
      location: data.location,
      hit: data.hit,
      isAim: false
    })
  }
}

export { Shot }
