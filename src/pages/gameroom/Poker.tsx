import React, {useEffect, useState} from "react";

import {Box, Button, Image, ButtonGroup, Text, useToast} from "@chakra-ui/react";
import useLocalStorage from "use-local-storage";
import {IncomingOptions  } from "use-http";
import {CachePolicies} from "use-http/dist/cjs/types";
import useApi from "../../components/useApi";

export default function  Poker({roomStatus,roomId,user,isPay}:{roomStatus:number,roomId:string|undefined,user:AdminProps|undefined,isPay:boolean}){
    const [adminData] = useLocalStorage<AdminProps | undefined>('adminData', undefined)
    const options: IncomingOptions = {
        headers: {
            Authorization: adminData?.token?adminData?.token:"",
        },
        cachePolicy: CachePolicies.NO_CACHE,
    };
    const toast = useToast()

    /**
     * 获取牌
     * @param card
     */
    const getCardImagePath = (card:PokerProps) => {
        if(card.value>13){
            return  `/image/${card.value}.png`
        }
        return `/image/${card.type}/${card.value}.png`;
    }



    /***
     * 选中的牌
     */
    const [selectedCards, setSelectedCards] = useState(new Array<PokerProps>());
    useEffect(() => {
        setSelectedCards([])
    },[user])
    /**
     * 修改选中的牌
     * @param card
     */
    const handleCardClick = (card:PokerProps) => {
        console.log(card)
        if (selectedCards.includes(card)) {
            setSelectedCards(selectedCards.filter((selectedCard) => selectedCard !== card));
        } else {
            setSelectedCards([...selectedCards, card]);
        }
    };
    //出牌
    const { post:playCards, response:playCardsResult }  =   useApi('/cards/pay/'+roomId,options);

    const  handlePlayCards=() =>{
        playCards({card:selectedCards,userId:adminData?.id}).then(data=>
        {
            if(playCardsResult.ok){
                if(data.status ===200){
                    setSelectedCards([])
                }else {
                    toast({ title: data.msg, status: 'error' })
                }
            }
        })
    }

    //不出
    const {post: pass} = useApi('/cards/pass/' + roomId,options);
    const  handlePass=async () => {
        setSelectedCards([])
        await pass()
    }
    const { put:putContinue } =  useApi('/cards/'+roomId,options);
    //准备
    const handleContinue=()=>{
        putContinue().then(data=>{})
    }
    const { del:delQuit,response:postContendResp} =  useApi('/cards/'+roomId,options);
    //退出房间
    const handleQuit=()=>{
        delQuit().then(data=>{
            if(postContendResp.ok){
                if(data.status ===200){
                    window.open("/dashboard","_top")
                }
            }
        })
    }
    const { post:postContend } =  useApi('/cards/contend',options);
    //抢地主
    const handleContend=(isContend:boolean)=>{
        postContend(new URLSearchParams(`?roomCode=${roomId}&isContend=${isContend}`)).then(data=>{})
    }

    const cardWidth = 122;
    const cardHeight = 180; // 设置牌的高度
    const cardOverlap = 50;
    const extraWidth = 40; // 增加的额外宽度
    const totalWidth = cardWidth + (user?.handCard?.length || 1 - 1) * cardOverlap + extraWidth;
    const buttonGroup : React.ReactNode[] = [
        <ButtonGroup>
            {user?.isContinue ? <Text fontSize="md">已准备 Ready</Text> :
                <>
                    <Button onClick={() => handleContinue()}>准备 Ready?</Button>
                    <Button onClick={() => handleQuit()}>退出房间 Exit the room</Button>
                </>
            }
        </ButtonGroup>,
        <ButtonGroup>
            {isPay && <Button  onClick={() => handleContend(true)}   style={{ marginRight: '150px' }}>抢地主 Running for the landlord</Button>}
            {isPay && <Button  onClick={() => handleContend(false)}>不抢 Not Running for the landlord</Button>}
        </ButtonGroup>,
        <ButtonGroup>
            {isPay && <Button  onClick={() => handlePlayCards()}   style={{ marginRight: '150px' }}>出牌 Play cards</Button>}
            {isPay && <Button  onClick={() => handlePass()}>不出 Pass</Button>}
        </ButtonGroup>,
        <ButtonGroup>
            {user?.isContinue ? <Text fontSize="md">已准备 Ready</Text> :(
                <>
                    <Button onClick={() => handleQuit()}>退出房间 Exit the room</Button>
                    <Button onClick={() => handleContinue()}>准备 Ready?</Button>
                </>
            )
            }
        </ButtonGroup>
    ]
    return (
        <Box position="relative" mt={4}>
            <Image
                position="fixed"
                left="200px"
                src={user?.head}
                alt="Landlord Icon"
                boxSize="50px"
                minW={`${cardWidth}px`}
                minH={`180px`}
            />
            <Box
                display="flex"
                justifyContent="center"
                position="relative"
                width={`${totalWidth}px`}
                margin="0 auto"
            >
                <Box display="flex" justifyContent="center" position="absolute" top={`-${cardHeight / 2}px`} zIndex="1">
                    {buttonGroup[roomStatus-1]}
                </Box>
                {user?.handCard?.map((card, index) => (
                    <Box
                        key={index}
                        position="absolute"
                        left={`${index * cardOverlap}px`}
                        p={1}
                        onClick={() => handleCardClick(card)}
                        cursor="pointer"
                        transform={selectedCards.includes(card) ? "translateY(-10px)" : ""}
                        transition="transform 0.2s"
                    >
                        <Image bg='white'
                               src={getCardImagePath(card)}
                               width={`${cardWidth}px`}
                               height={`${cardHeight}px`}
                               objectFit="cover"
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );

}

