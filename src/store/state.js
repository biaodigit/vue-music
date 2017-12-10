import {playMode} from 'common/js/config'
import {getSearchHistory, getFavorites} from 'common/js/storage'

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
  favoriteList: getFavorites()
}

export default state
