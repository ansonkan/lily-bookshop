import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Center,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import Zdog from 'zdog'

import { createReadingBench, createSunAndCloud } from '@models'

import styles from './styles.module.scss'

export const LandingScene = (): JSX.Element => {
  const mainDivRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const bpConfigs = useBreakpointValue(
    {
      base: { zoom: 0.6, x: 0.8, y: 0.5 },
      sm: { zoom: 0.7, x: 0.6, y: 0.4 },
      md: { zoom: 0.8, x: 0.5, y: 0.4 },
      lg: { zoom: 0.9, x: 0.35, y: 0.4 },
      xl: { zoom: 1, x: 0.3, y: 0.4 },
    },
    { ssr: false }
  )

  useEffect(() => {
    if (!canvasRef.current) return

    let isOn = true

    const illo = new Zdog.Illustration({
      element: canvasRef.current,
      resize: true,
      dragRotate: true,
    })

    const readingBench = createReadingBench({
      addTo: illo,
      rotate: { x: Zdog.TAU / 6, z: Zdog.TAU / 8 },
    })

    const sunAndCloud = createSunAndCloud({
      addTo: illo,
      rotate: { x: Zdog.TAU / 6, z: Zdog.TAU / -8 },
    })

    function animate() {
      if (!isOn) return

      if (mainDivRef.current && bpConfigs) {
        illo.zoom = bpConfigs.zoom

        const w = mainDivRef.current.clientWidth
        const h = mainDivRef.current.clientHeight

        readingBench.model.translate.x = w * bpConfigs.x
        readingBench.model.translate.y = h * bpConfigs.y

        sunAndCloud.model.translate.x = w * bpConfigs.x * -1
        sunAndCloud.model.translate.y = h * bpConfigs.y * -1
      }

      readingBench.animate?.()
      illo.updateRenderGraph()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isOn = false
    }
  }, [bpConfigs])

  return (
    <Box position="relative" h="full">
      <canvas className={styles.canvas} ref={canvasRef} />

      <Container h="full" ref={mainDivRef}>
        <Center h="full">
          <Flex
            direction="column"
            gap={4}
            backdropFilter="auto"
            backdropBlur="sm"
            bgColor="whiteAlpha.500"
            borderBottom="1px"
            borderColor="whiteAlpha.500"
          >
            <Heading>Welcome to Lily Bookshop! :D</Heading>

            <InputGroup>
              <InputLeftElement>
                <SearchIcon />
              </InputLeftElement>
              <Input placeholder="Looking for your next book?" />
            </InputGroup>
          </Flex>
        </Center>
      </Container>
    </Box>
  )
}
