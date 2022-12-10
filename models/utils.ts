import Zdog from 'zdog'

export const getRandomCoordinate = (limit: number) =>
  Math.random() * limit - limit / 2

export const getRandomRotation = () => Zdog.TAU / (Math.random() + 1)

export const getRandomInt = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max + 0.1))

interface GetRandomColorProps {
  h?: number
  s?: number
  l?: number
  a?: number
}

export function getRandomColor(props?: GetRandomColorProps): string {
  const {
    h = getRandomInt(0, 360),
    s = getRandomInt(0, 100),
    l = getRandomInt(0, 100),
    a = getRandomInt(0, 100),
  } = props || {}

  return `hsl(${h}, ${s}%, ${l}%, ${a}%)`
}
