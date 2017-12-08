export function shuffle(arr) {
  let list = [...arr]
  for (let i = 0; i < list.length; i++) {
    let j = randomNum(0, i)
    let t = list[i]
    list[i] = list[j]
    list[j] = t
  }
  return list
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function deBounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
