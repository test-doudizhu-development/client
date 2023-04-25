import React, { useState } from 'react';
import {
    Box,
    IconButton,
    useColorModeValue,
    useMediaQuery,
} from '@chakra-ui/react';
import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai';
import { BsFillVolumeUpFill, BsFillVolumeMuteFill } from 'react-icons/bs';

interface MusicPlayerProps {
    audioUrl: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioUrl }) => {
    const [audio] = useState(new Audio(audioUrl));
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isMobile] = useMediaQuery('(max-width: 480px)');

    const handlePlayPause = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleMute = () => {
        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    return (
        <Box
            position="fixed"
            bottom="1rem"
            right="1rem"
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow="lg"
            p="0.5rem"
            borderRadius="lg"
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            alignItems="center"
        >
            <IconButton
                aria-label="Play or pause music"
                icon={isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
                onClick={handlePlayPause}
                mr={!isMobile ? '0.5rem' : undefined}
                mb={isMobile ? '0.5rem' : undefined}
            />
            <IconButton
                aria-label="Mute or unmute music"
                icon={isMuted ? <BsFillVolumeMuteFill /> : <BsFillVolumeUpFill />}
                onClick={handleMute}
            />
        </Box>
    );
};

export default MusicPlayer;
