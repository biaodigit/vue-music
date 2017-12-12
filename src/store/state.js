import {playMode} from 'common/js/config'
import {getSearchHistory, getFavorites, getPlayHistory} from 'common/js/storage'

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
  favoriteList: getFavorites(),
  playHistory: getPlayHistory()
}

export default state
