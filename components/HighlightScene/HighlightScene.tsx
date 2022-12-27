import { useEffect, useRef } from 'react'
import Zdog from 'zdog'

import { createMegaStar } from 'models'
import { throttle } from 'utils'

import styles from './styles.module.scss'

export const HighlightScene = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const illo = useRef<Zdog.Illustration>()
  const megaStar = useRef<ReturnType<typeof createMegaStar>>()

  useEffect(() => {
    if (!canvasRef.current) return

    let isOn = true

    illo.current = new Zdog.Illustration({
      element: canvasRef.current,
      resize: true,
    })

    megaStar.current = createMegaStar({
      addTo: illo.current,
      rotate: { x: Zdog.TAU / -15, y: Zdog.TAU / 10 },
    })
    const throttledSpin = throttle(megaStar.current.spin, 60000)

    const onResize = () => {
      if (!megaStar.current || !canvasRef.current) return

      megaStar.current.model.translate.x = canvasRef.current.clientWidth / 3
      megaStar.current.model.translate.y = canvasRef.current.clientHeight / -3
    }

    onResize()
    window.addEventListener('resize', onResize)

    let hasAppeared = false
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAppeared) {
              megaStar.current?.appear()
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
      if (!isOn || !megaStar.current || !illo.current) return

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
