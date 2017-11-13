import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false,
  playlist: [],
  sequenceList: [],
  currentIndex: -1,
  fullScreen: false,
  mode: playMode.sequence
}

export default state
