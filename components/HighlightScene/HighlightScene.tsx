import { useEffect, useRef } from 'react'
import Zdog from 'zdog'
import { Button, ButtonGroup } from '@chakra-ui/react'

import { createMegaStar } from '@models'

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
      dragRotate: true,
    })

    megaStar.current = createMegaStar({
      addTo: illo.current,
    })

    function animate() {
      if (!isOn || !megaStar.current || !illo.current) return

      // megaStar.current.animate?.()
      illo.current.updateRenderGraph()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isOn = false
    }
  }, [])

  return (
    <>
      <canvas className={styles.canvas} ref={canvasRef} />

      <ButtonGroup position="absolute" bottom="0" right="0">
        <Button
          onClick={() => {
            megaStar.current?.spin()
          }}
        >
          spin
        </Button>
      </ButtonGroup>
    </>
  )
}
