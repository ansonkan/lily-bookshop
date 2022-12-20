import { useEffect, useRef } from 'react'
import Zdog from 'zdog'
import { useBreakpointValue } from '@chakra-ui/react'

import {
  CreateModelResult,
  createReadingBench,
  createSunAndCloud,
} from '@models'

import styles from './styles.module.scss'

export const LandingScene = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const illo = useRef<Zdog.Illustration>()
  const readingBench = useRef<CreateModelResult>()
  const sunAndCloud = useRef<CreateModelResult>()

  const bpConfigs = useBreakpointValue({
    base: { zoom: 0.6, x: 0.7, y: 0.45 },
    sm: { zoom: 0.7, x: 0.6, y: 0.4 },
    md: { zoom: 0.8, x: 0.5, y: 0.4 },
    lg: { zoom: 0.9, x: 0.35, y: 0.4 },
    xl: { zoom: 1, x: 0.3, y: 0.4 },
  })

  useEffect(() => {
    if (!canvasRef.current) return

    let isOn = true

    illo.current = new Zdog.Illustration({
      element: canvasRef.current,
      resize: true,
      // dragRotate: true,
    })

    readingBench.current = createReadingBench({
      addTo: illo.current,
      rotate: { x: Zdog.TAU / 6, z: Zdog.TAU / 8 },
    })

    sunAndCloud.current = createSunAndCloud({
      addTo: illo.current,
      rotate: { x: Zdog.TAU / 6, z: Zdog.TAU / -8 },
    })
    function animate() {
      if (!isOn || !readingBench.current || !illo.current) return

      readingBench.current.animate?.()
      illo.current.updateRenderGraph()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isOn = false
    }
  }, [])

  useEffect(() => {
    if (
      !canvasRef.current ||
      !readingBench.current ||
      !sunAndCloud.current ||
      !illo.current ||
      !bpConfigs
    )
      return

    illo.current.zoom = bpConfigs.zoom

    const w = canvasRef.current.clientWidth
    const h = canvasRef.current.clientHeight

    readingBench.current.model.translate.x = Math.min(
      Math.max(w * bpConfigs.x, 350),
      500
    )
    readingBench.current.model.translate.y = Math.max(h * bpConfigs.y * -1, 150)

    sunAndCloud.current.model.translate.x = Math.max(
      Math.min(w * -bpConfigs.x, -250),
      -500
    )
    sunAndCloud.current.model.translate.y = Math.min(h * bpConfigs.y * -1, -150)
  }, [bpConfigs])

  return <canvas ref={canvasRef} className={styles.canvas} />
}
