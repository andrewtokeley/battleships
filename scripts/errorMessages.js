
import { ErrorType } from './Types'

export const errorMessage = function (errorCode) {
  switch (errorCode) {
    case ErrorType.GameFull.code.toString(): { return 'Game full' }
    default: return 'Unknown Error ' + errorCode
  }
}
