import { useEffect, useRef, useState } from 'react'
import Zdog from 'zdog'

import { createNewBooks } from 'models'

import styles from './styles.module.scss'

export const BaseLayoutScene = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const illo = useRef<Zdog.Illustration>()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    let isOn = true
    let needUpdateCount = 1

    illo.current = new Zdog.Illustration({
      element: canvasRef.current,
      resize: true,
    })

    createNewBooks({
      addTo: illo.current,
      columns: 10,
      booksPerColumn: 3,
      appeared: true,
    })

    const onResize = () => {
      needUpdateCount++
    }
    window.addEventListener('resize', onResize)

    function animate() {
      if (!isOn || !illo.current) return

      if (needUpdateCount > 0) {
        illo.current.updateRenderGraph()
        needUpdateCount--
      }

      requestAnimationFrame(animate)
    }

    animate()
    setVisible(true)

    return () => {
      isOn = false
      window.removeEventListener('resize', onResize)
    }
  }, [setVisible])

  return (
    <canvas
      className={`${styles.canvas} ${visible ? styles.visible : ''}`}
      ref={canvasRef}
    />
  )
}
