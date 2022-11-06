import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import CloseIcon from '@mui/icons-material/Close';


export default function Train({}) {

    const {
        show,
        setShow,
        NFTARENA_WRITE,
        NFTARENA_READ,
        currentPlayer,
    } = useContext(MainContext);

    const [startTime, setStartTime] = useState(0);


    useEffect(() => {      
        async function fetchTrain() {
            const time = (await NFTARENA_READ?.trainings(currentPlayer.tokenId)).toNumber();
            setStartTime(time);

        }
        if (NFTARENA_READ && currentPlayer) {
            fetchTrain();
        }
    }, [NFTARENA_READ, currentPlayer]);



    return (
        <Box
        display={show == "train" ? "flex" : "none"}
        width={"80%"}
        height={"80%"}
        bgcolor="#e3f2fd"
        position={"absolute"}
        top="8%"
        left="19%"
        sx={{ borderRadius: "5%" }}
      >
        <Box position={"absolute"} top="3%" left="92%">
          <Button onClick={() => setShow(false)} size="medium">
            <CloseIcon />
          </Button>
        </Box>  

        <Box position={"absolute"} top="5%" left="40%">
          <Typography fontSize={24}>Training Grounds</Typography>
        </Box>

        <Box component="img" src={currentPlayer && currentPlayer.uri} 
            width={"20%"} height={"20%"} position={"absolute"} top="25%" left="30%">
        </Box>

        {currentPlayer && (
            <Box width={"50%"} height={"50%"} position={"absolute"}>
                <Typography fontSize={24}>{currentPlayer.status == 2 ?  startTime : "not training"} Training info</Typography>
            </Box>
        )}



        {currentPlayer && (
            <Box width={"50%"} height={"50%"} position={"absolute"} top="60%" left="30%">
                <Typography fontSize={24}>{currentPlayer.status == 2 ?  "You are Training" : "You Are Not Training"}</Typography>
            </Box>
        )}

        {currentPlayer && (
            <Box width={"50%"} height={"50%"} position={"absolute"} top="80%" left="50%">
                <Typography fontSize={24}>{Date.now() - startTime }</Typography>
            </Box>
        )}

        <Box position={"absolute"} top="80%" left="20%">
            <Button onClick={() => NFTARENA_WRITE.startTraining(currentPlayer.tokenId)}>
                Begin Training
            </Button>
        </Box>
        <Box position={"absolute"}top="80%" left="45%">
            <Button onClick={() => NFTARENA_WRITE.endTraining(currentPlayer.tokenId)}>
                Finish Training
            </Button>
        </Box>

      </Box>
    );
}

