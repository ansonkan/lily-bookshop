import { useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Center,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
  Button,
  ButtonGroup,
  Link,
  useBreakpointValue,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import Zdog from 'zdog'

import {
  createReadingBench,
  createSunAndCloud,
  CreateModelResult,
} from '@models'

import styles from './styles.module.scss'

export const LandingScene = (): JSX.Element => {
  const mainDivRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const illo = useRef<Zdog.Illustration>()
  const readingBench = useRef<CreateModelResult>()
  const sunAndCloud = useRef<CreateModelResult>()

  const bpConfigs = useBreakpointValue(
    {
      base: { zoom: 0.6, x: 0.7, y: 0.45 },
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
      !illo.current ||
      !readingBench.current ||
      !sunAndCloud.current ||
      !mainDivRef.current ||
      !bpConfigs
    )
      return

    illo.current.zoom = bpConfigs.zoom

    const w = mainDivRef.current.clientWidth
    const h = mainDivRef.current.clientHeight

    readingBench.current.model.translate.x = w * bpConfigs.x
    readingBench.current.model.translate.y = h * bpConfigs.y

    sunAndCloud.current.model.translate.x = w * bpConfigs.x * -1
    sunAndCloud.current.model.translate.y = h * bpConfigs.y * -1
  }, [bpConfigs])

  return (
    <Box position="relative" h="full">
      <canvas className={styles.canvas} ref={canvasRef} />

      <Container h="full" ref={mainDivRef}>
        <Center h="full">
          <Flex direction="column" gap={4}>
            <Heading
              as="h1"
              fontSize={['2xl', '4xl', '4xl', '5xl']}
              textAlign="center"
            >
              Looking for your next book?
            </Heading>

            <InputGroup backdropFilter="auto" backdropBlur="sm">
              <InputLeftElement>
                <SearchIcon />
              </InputLeftElement>
              <Input placeholder="A title, author, ISBN, or anything really..." />
            </InputGroup>

            <ButtonGroup alignSelf="center">
              <Button as={Link} href="#about">
                Visit us
              </Button>
              <Button>Check out our blog</Button>
            </ButtonGroup>
          </Flex>
        </Center>
      </Container>
    </Box>
  )
}
