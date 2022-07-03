import { v4 as uuidv4 } from 'uuid'

class Missile {
  constructor (location, hit) {
    this.id = uuidv4()
    this.location = location
    this.hit = hit
  }
}

export { Missile }
