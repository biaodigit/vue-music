import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearHistory, addFavoriteSong, deleteFavoriteSong, setPlayHistory} from 'common/js/storage'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export function selectPlay({commit, state}, {list, index}) {
  commit(types.SET_PLAYING_STATE, true)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
}

export function randomPlay({commit}, {list}) {
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_PLAY_MODE, playMode.random)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
}

export function insertSong({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let currentSong = playlist[currentIndex]
  let mode = state.mode
  let fpIndex = findIndex(playlist, song)
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  if (mode === playMode.random) {
    playlist = shuffle(playlist)
    commit(types.SET_PLAYLIST, playlist)
  } else {
    commit(types.SET_PLAYLIST, playlist)
  }
  console.log(playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export function saveSearchHistory({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export function deleteSearchHistory({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export function clearSearchHistory({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearHistory())
}

export function deleteSong({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)

  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

export function clearPlaylist({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

export function addFavorite({commit}, song) {
  commit(types.SET_FAVORITE_LIST, addFavoriteSong(song))
}

export function deleteFavorite({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavoriteSong(song))
}

export function setHistory({commit}, song) {
  commit(types.SET_PLAY_HISTORY, setPlayHistory(song))
}
