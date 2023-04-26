import {Box, Center, Container, Flex, Heading, Image, Text} from '@chakra-ui/react'
import React, {useEffect, useState} from 'react'
import { useParams} from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import Poker from "./Poker";
import PlayerCard from "./PlayerCard";
import MusicPlayer from "./MusicPlayer";

export default function Room() {
    //当前登录的用户信息
    const [adminData] = useLocalStorage<AdminProps | undefined>('adminData', undefined)
    //房间号
    const { roomId } = useParams()
    //音乐地址
    const audioUrl = '/music/667.mp3';

    //上一副牌
    const [last,setLast] = useState<Array<PokerProps> | undefined >(undefined);
    const cardWidth = 122;
    const cardHeight = 180; // 设置牌的高度
    const cardOverlap = 50;
    const extraWidth = 40; // 增加的额外宽度
    const totalWidth = cardWidth + (last?.length || 1 - 1) * cardOverlap + extraWidth;
    //我的
    const [my,setMy] = useState(adminData);
    //left
    const [left,setLeft] = useState<AdminProps | undefined >(undefined);
    //right
    const [ right,setRight] = useState<AdminProps | undefined >(undefined);
    //游戏阶段
    const [roomStatus,setRoomStatus] = useState(0);
    //是否出牌
    const [isPay,setIsPay] = useState(false);
    //游戏结果
    const [result,setResult] = useState<string|undefined>();
    //地主牌
    const  [pokers,setPokers] = useState<Array<PokerProps> | undefined >(undefined);
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
     * 排序
     * @param arr
     */
    const sortByValueAndType = (arr: PokerProps[]|undefined)=>{
        if(!arr){
            return arr;
        }
        return arr.sort((a, b) => {
            if (a.value < b.value) {
                return -1;
            } else if (a.value > b.value) {
                return 1;
            }
            if (a.type < b.type) {
                return -1;
            } else if (a.type > b.type) {
                return 1;
            }
            return 0;
        });
    }
    const updateGameContextDate = (data:GameContextProps)=>{
        if(!data.userList){
            return;
        }
        let place = 0;
        for (let i = 0; i < data.userList.length; i++) {
            if(data.userList[i]){
                //确定地主头像
                if(data.gameStatus >2  && i==data.start){
                    data.userList[i].head='/image/Picture6.png';
                }else {
                    data.userList[i].head='/image/Picture1.png';
                }
                if (  data.userList[i].token === adminData?.token) {
                    place = i;
                }
                //获取当前玩家
                data.userList[i].handCard = sortByValueAndType(data.userList[i].handCard);

            }
        }
        if(data.now!=undefined){
            data.userList[data.now].status='on';
        }
        setPokers(data.pokers)
        setResult(data.winner==undefined ?undefined:(data.winner==data.start?'地主胜利':'农民胜利'))
        setIsPay(data.now === place)
        setRoomStatus(data.gameStatus)
        setMy(data.userList[place])
        setLast(data.last?.card)
        console.log("当前出牌",data.last?.card)
        if(place===0){
            setLeft( data.userList[2])
            setRight(data.userList[1])
        }
        if(place===1){
            setLeft( data.userList[0])
            setRight(data.userList[2])
        }
        if(place===2){
            setLeft( data.userList[1])
            setRight(data.userList[0])
        }

    }

    useEffect(() => {
        
        //const apiUrl = process.env.REACT_SOCKET_API_URL;
        //const ws = new WebSocket(`ws:/doudizhu-server.oa.r.appspot.com/ws/room/sync/${adminData?.token}`);
        //const ws = new WebSocket(`${apiUrl}/ws/ddz/sync/${adminData?.token}`);
        //本地跑
        //const ws = new WebSocket(`ws:/localhost:8080/ws/ddz/sync/${roomId}/${adminData?.token}`);
        //云上跑
        const ws = new WebSocket(`wss:/test-ddzdep-server.oa.r.appspot.com/ws/ddz/sync/${roomId}/${adminData?.token}`);

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            console.log('WebSocket received message:', event.data);
            const result =  JSON.parse(event.data) as ResultProps<GameContextProps>
            if(result.status === 200 ){
                const data : GameContextProps = result.data;
                updateGameContextDate(data)
            }
        };

        ws.onclose = () => {
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // 在组件卸载时关闭WebSocket连接
        return () => {
            ws.close();
        };
    }, []);

    return (
      <Flex
          backgroundRepeat='no-repeat'
          backgroundSize='cover'
          bgImage="url('/image/05b6a71c48ac19ba9097a5bb44daa7e1.png')"
          direction="column"
          h="100vh"
          w="100vw"
      >
          {/* Top */}
          <Box h="10%" w="100%" >
              <Container gap={6} display="flex"
                         justifyContent="center"
                         position="relative"
                         width='100%'
                         margin="0 auto"
                         w='lg'   boxShadow='lg' rounded='3xl' >
                  {pokers?.map((card, index) => (
                      <Box
                          key={index}
                          p={1}
                          left={`${index * cardOverlap}px`}
                      >
                          <Image
                              bg='white'
                              src={roomStatus==3?getCardImagePath(card):'/image/c.png'}
                              width={`${cardWidth/2}px`}
                              height={`${cardHeight/2}px`}
                              objectFit="cover"
                          />
                      </Box>
                  ))}
              </Container>
          </Box>
          <Flex
              direction="row"
              flex="1"
          >
              {/* Left */}
              <Box  h="100%" w="20%">
                  {
                      left &&  <PlayerCard user={left}/>
                  }
              </Box>
              <Flex
                  direction="column"
                  flex="1"
                  borderWidth="1px"
                  borderColor="gray.200"
                  borderRadius="md"
              >

                  {/* Center */}
                  <Center
                      h="60vh" w="60vw"
                      justifyContent="center"
                      position="absolute"
                      alignItems='center'
                  >
                      {result && <Text textAlign='center' w='md' color='gray.600'>`{result}`</Text>}
                      {last?.map((card, index) => (
                          <Box
                              key={index}
                              position="absolute"
                              p={1}
                              cursor="pointer"
                              left={`${index * cardOverlap}px`}
                          >
                              <Image
                                  bg='white'
                                  src={getCardImagePath(card)}
                                  width={`${cardWidth}px`}
                                  height={`${cardHeight}px`}
                                  objectFit="cover"
                              />
                          </Box>
                      ))}
                  </Center >
              </Flex>
              {/* Right */}
              <Box h="100%" w="20%">
                  {
                      right &&  <PlayerCard user={right}/>
                  }
              </Box>
          </Flex>
          {/* Bottom */}
          <Box h="30%" w="100%">
              <Poker roomStatus={roomStatus} user={my} roomId={roomId} isPay={isPay}/>
              <MusicPlayer audioUrl={audioUrl} />
          </Box>
      </Flex>
  )
}
