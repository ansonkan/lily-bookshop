export const throttle = <T>(fn: () => T, delay = 1000) => {
  let onCoolDown = false
  let timeout: NodeJS.Timeout | undefined

  return () => {
    if (!timeout) {
      setTimeout(() => {
        onCoolDown = true
      }, 0)

      timeout = setTimeout(() => {
        onCoolDown = false
        timeout = undefined
      }, delay)
    }

    return onCoolDown ? undefined : fn()
  }
}
