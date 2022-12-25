import { useEffect, useRef } from 'react'
import Zdog from 'zdog'

import { createNewBooks } from 'models'

import styles from './styles.module.scss'

export const BaseLayoutScene = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const illo = useRef<Zdog.Illustration>()

  useEffect(() => {
    if (!canvasRef.current) return

    let isOn = true

    illo.current = new Zdog.Illustration({
      element: canvasRef.current,
      resize: true,
    })

    createNewBooks({
      addTo: illo.current,
      columns: 10,
      booksPerColumn: 10,
    })

    function animate() {
      if (!isOn || !illo.current) return

      illo.current.updateRenderGraph()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isOn = false
    }
  }, [])

  return <canvas className={styles.canvas} ref={canvasRef} />
}
