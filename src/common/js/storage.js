import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 20

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 300

const HISTORY_KEY = '__history__'
const HISTORY_MAX_LEN = 200

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, query, (item) => {
    return query === item
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function getSearchHistory() {
  return storage.get(SEARCH_KEY, [])
}

export function clearHistory() {
  storage.remove(SEARCH_KEY)
  return []
}

export function addFavoriteSong(song) {
  let favorites = storage.get(FAVORITE_KEY, [])
  favorites.unshift(song)
  if (favorites.length > FAVORITE_MAX_LEN) {
    favorites.pop()
  }
  storage.set(FAVORITE_KEY, favorites)
  return favorites
}

export function deleteFavoriteSong(song) {
  let favorites = storage.get(FAVORITE_KEY, [])
  deleteFromArray(favorites, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, favorites)
  return favorites
}

export function getFavorites() {
  return storage.get(FAVORITE_KEY, [])
}

export function setPlayHistory(song) {
  let history = storage.get(HISTORY_KEY, [])
  insertArray(history, song, (item) => {
    return song.id === item.id
  }, HISTORY_MAX_LEN)
  storage.set(HISTORY_KEY, history)
  return history
}

export function getPlayHistory() {
  return storage.get(HISTORY_KEY, [])
}
