export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

export const tabsData = {
  data: tabs()
}
export function tabs() {
  let ret = []
  for (let i = 0; i < 26; i++) {
    ret.push(String.fromCharCode(65 + i))
  }
  ret.unshift('热门')
  return ret
}
