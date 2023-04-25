import { Icon } from '@chakra-ui/icons'
import { Button, ButtonGroup, Container, Flex, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { LineBackground } from '../components/Backgrounds'

export default function Home() {

    return (
        <Stack minH='100vh' minW='fit-content' p={7} spacing={16} position='relative'
               backgroundRepeat='no-repeat'
               backgroundSize='cover'
               bgImage="url('/image/05b6a71c48ac19ba9097a5bb44daa7e1.png')"
        >
            <Flex align='end' justify='space-between'>
                <Flex align='end' gap={2} flexGrow={1}>
                    {/*<Stack align='end' spacing={-2} fontSize='xl' color='blue.500'>*/}
                    {/*  <Icon as={GoPrimitiveDot} />*/}
                    {/*  <HStack spacing={-2}>*/}
                    {/*    <Icon as={GoPrimitiveDot} />*/}
                    {/*    <Icon as={GoPrimitiveDot} />*/}
                    {/*  </HStack>*/}
                    {/*  <HStack spacing={-2}>*/}
                    {/*    <Icon as={GoPrimitiveDot} />*/}
                    {/*    <Icon as={GoPrimitiveDot} />*/}
                    {/*    <Icon as={GoPrimitiveDot} />*/}
                    {/*  </HStack>*/}
                    {/*</Stack>*/}
                </Flex>
                <ButtonGroup>
                    <Button variant='round-outline' as={Link} to='login'>登录 Login</Button>
                    <Button variant='round' as={Link} to='register'>注册 Register</Button>
                </ButtonGroup>
            </Flex>
            <VStack minH='50vh' maxH='100vh' justify='space-evenly'>
                <Button variant='round' minW='xs' as={Link} to='login'>开始游戏 Start the game</Button>
            </VStack>
            <LineBackground transform='scaleX(-1) rotate(90deg)' />
        </Stack>
    )
}
