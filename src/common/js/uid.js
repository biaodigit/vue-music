import storage from 'good-storage'

let _uid = 0
const UID_KEY = '__uid__'

export function getUid() {
  if (_uid) {
    return _uid
  }
  _uid = storage.get(UID_KEY)
  if (!_uid) {
    const t = (new Date()).getUTCMilliseconds()
    _uid = Math.round(2147483647 * Math.random()) * t % 1e10
    storage.set(UID_KEY, _uid)
  }
  return _uid
}
