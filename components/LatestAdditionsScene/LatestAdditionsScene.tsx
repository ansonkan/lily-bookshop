import { useEffect, useRef } from 'react'
import Zdog from 'zdog'

import { createNewBooks } from 'models'
import { throttle } from 'utils'

import styles from './styles.module.scss'

export const LatestAdditionsScene = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const illo = useRef<Zdog.Illustration>()
  const newBooks = useRef<ReturnType<typeof createNewBooks>>()

  useEffect(() => {
    if (!canvasRef.current) return

    let isOn = true

    illo.current = new Zdog.Illustration({
      element: canvasRef.current,
      resize: true,
      dragRotate: true,
    })

    newBooks.current = createNewBooks({
      addTo: illo.current,
      rotate: { x: Zdog.TAU / 6, z: Zdog.TAU / 8 },
    })
    const throttledSpin = throttle(newBooks.current.spin, 60000)

    const onResize = () => {
      if (!newBooks.current || !canvasRef.current) return

      newBooks.current.model.translate.x = canvasRef.current.clientWidth / 2.5
      newBooks.current.model.translate.y = canvasRef.current.clientHeight / -2
    }

    onResize()
    window.addEventListener('resize', onResize)

    let hasAppeared = false
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAppeared) {
              newBooks.current?.appear()
              hasAppeared = true
            } else {
              throttledSpin()
            }
          }
        })
      },
      {
        threshold: 0.5,
      }
    )

    observer.observe(canvasRef.current)

    function animate() {
      if (!isOn || !newBooks.current || !illo.current) return

      illo.current.updateRenderGraph()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isOn = false
      window.removeEventListener('resize', onResize)
      observer.disconnect()
    }
  }, [])

  return (
    <div className={styles.root}>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  )
}
