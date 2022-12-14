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
    })

    megaStar.current = createMegaStar({
      addTo: illo.current,
      rotate: { x: Zdog.TAU / -15, y: Zdog.TAU / 10 },
    })

    const onResize = () => {
      if (!megaStar.current || !canvasRef.current) return

      megaStar.current.model.translate.x = canvasRef.current.clientWidth / 3
      megaStar.current.model.translate.y = canvasRef.current.clientHeight / -2.5
    }

    onResize()
    window.addEventListener('resize', onResize)

    function animate() {
      if (!isOn || !megaStar.current || !illo.current) return

      illo.current.updateRenderGraph()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isOn = false
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <canvas className={styles.canvas} ref={canvasRef} />

      <ButtonGroup position="absolute" bottom="0" right="0">
        <Button
          onClick={() => {
            megaStar.current?.appear()
          }}
        >
          appear
        </Button>

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
