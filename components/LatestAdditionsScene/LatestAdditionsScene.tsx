import { useEffect, useRef } from 'react'
import Zdog from 'zdog'

import { createNewBooks } from '@models'

import styles from './styles.module.scss'

export const LatestAdditionsScene = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const illo = useRef<Zdog.Illustration>()
  const megaStar = useRef<ReturnType<typeof createNewBooks>>()

  useEffect(() => {
    if (!canvasRef.current) return

    let isOn = true

    illo.current = new Zdog.Illustration({
      element: canvasRef.current,
      resize: true,
      dragRotate: true,
    })

    megaStar.current = createNewBooks({
      addTo: illo.current,
      rotate: { x: Zdog.TAU / 6, z: Zdog.TAU / 8 },
    })

    const onResize = () => {
      if (!megaStar.current || !canvasRef.current) return

      megaStar.current.model.translate.x = canvasRef.current.clientWidth / 3
      megaStar.current.model.translate.y = canvasRef.current.clientHeight / -2.5
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
              megaStar.current?.spin()
            }
          }
        })
      },
      {
        threshold: 0.3,
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

  return <canvas className={styles.canvas} ref={canvasRef} />
}
