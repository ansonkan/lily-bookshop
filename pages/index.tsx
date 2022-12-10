import type { NextPage } from 'next'

import { useEffect, useRef } from 'react'
import Zdog from 'zdog'
import { Button, ButtonGroup } from '@chakra-ui/react'

import { createChillScene } from '@models'

import styles from './index.module.scss'

const ZDogPage: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const illoRef = useRef<Zdog.Illustration>()
  const needsRenderCountRef = useRef(1)

  useEffect(() => {
    if (!canvasRef.current) return

    let isRotating = false
    let needsUpdate = true

    const illo = new Zdog.Illustration({
      element: canvasRef.current,
      resize: true,
      dragRotate: true,
      onDragStart: () => {
        isRotating = false
        needsUpdate = true
      },
      onDragEnd: () => {
        needsUpdate = false
      },
      onResize: () => {
        needsUpdate = true
      },
      // zoom: 0.4,
      rotate: { x: Zdog.TAU / 6, z: Zdog.TAU / 8 },
      // rotate: { x: Zdog.TAU / 4 },
    })

    illoRef.current = illo

    const chillScene = createChillScene({ addTo: illo })
    // createBook({ addTo: illo, isOpen: true })

    function animate() {
      // rotate illo each frame
      if (isRotating) {
        illo.rotate.y += 0.003
        illo.rotate.x -= 0.004

        needsUpdate = true
      }

      chillScene.animate?.()

      if (needsRenderCountRef.current || needsUpdate) {
        illo.updateRenderGraph()

        if (needsRenderCountRef.current > 0) needsRenderCountRef.current--
      }

      // animate next frame
      requestAnimationFrame(animate)
    }

    // start animation
    animate()
  }, [])

  return (
    <div className={styles.root}>
      <canvas className={styles.canvas} ref={canvasRef} />

      <ButtonGroup>
        <Button
          onClick={() => {
            if (illoRef.current) {
              illoRef.current.rotate.x = Zdog.TAU / 4
              illoRef.current.rotate.y = 0
              illoRef.current.rotate.z = 0

              needsRenderCountRef.current++
            }
          }}
        >
          1
        </Button>
        <Button
          onClick={() => {
            if (illoRef.current) {
              illoRef.current.rotate.x = 0
              illoRef.current.rotate.y = Zdog.TAU / 4
              illoRef.current.rotate.z = 0

              needsRenderCountRef.current++
            }
          }}
        >
          2
        </Button>
        <Button
          onClick={() => {
            if (illoRef.current) {
              illoRef.current.rotate.x = 0
              illoRef.current.rotate.y = 0
              illoRef.current.rotate.z = Zdog.TAU / 4

              needsRenderCountRef.current++
            }
          }}
        >
          3
        </Button>
        <Button
          onClick={() => {
            if (illoRef.current) {
              illoRef.current.rotate.x = Zdog.TAU / 6
              illoRef.current.rotate.y = 0
              illoRef.current.rotate.z = Zdog.TAU / 8

              needsRenderCountRef.current++
            }
          }}
        >
          Reset
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default ZDogPage
