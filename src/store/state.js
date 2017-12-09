import {playMode} from 'common/js/config'
import {getSearchHistory} from 'common/js/storage'

const state = {
  singer: {},
  playing: false,
  playlist: [],
  sequenceList: [],
  currentIndex: -1,
  fullScreen: false,
  mode: playMode.sequence,
  disc: {},
  topList: {},
  searchHistory: getSearchHistory(),
  favouriteList: []
}

export default state
