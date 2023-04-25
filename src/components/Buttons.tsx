import { Button } from '@chakra-ui/react'
import { capitalize } from 'lodash'
import React from 'react'
import { IconType } from 'react-icons'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

export function SidebarButton(props: { to: string, isEnd?: boolean, icon: IconType ,tagName : string  }) {
    const targetPath = useResolvedPath(props.to)
    const currentPath = useMatch({ path: targetPath.pathname, end: props.isEnd })
    return <Button as={Link} to={targetPath.pathname} leftIcon={<props.icon fontSize='1.2rem' />}
                   justifyContent='start' w='full' iconSpacing={3} _active={{ bg: 'gray.100' }}
                   isActive={!!currentPath}>{ !props.tagName ? capitalize(props.to) : props.tagName   }</Button>
}
