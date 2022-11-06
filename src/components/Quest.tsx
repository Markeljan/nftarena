import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import CloseIcon from '@mui/icons-material/Close';

export default function Quest({}) {

    const {
        show,
        setShow,
        NFTARENA_WRITE,
        NFTARENA_READ,
        currentPlayer,
      } = useContext(MainContext);

      const [endTime, getEndTime] = useState(0);

    useEffect(() => {      
        async function fetchQuest() {
            const time = (await NFTARENA_READ?.quests(currentPlayer.tokenId)).toNumber();
            getEndTime(time);
            
        }
        if (NFTARENA_READ && currentPlayer) {
            fetchQuest();
        }
    }, [NFTARENA_READ, currentPlayer]);

    return (
        <Box
        display={show === "quest" ? "flex" : "none"}
        width={"80%"}
        height={"80%"}
        bgcolor="#e3f2fd"
        position={"absolute"}
        top="10%"
        left="19%"
        sx={{ borderRadius: "5%" }}
      >
        <Box position={"absolute"} top="3%" left="92%">
          <Button onClick={() => setShow(false)} size="medium">
            <CloseIcon />
          </Button>
        </Box>  

        <Box position={"absolute"} top="5%" left="40%">
          <Typography fontSize={24}>Time to Quest</Typography>
        </Box>

        {currentPlayer && (
            <Box width={"50%"} height={"50%"} position={"absolute"}>
                <Typography fontSize={24}>{currentPlayer.status == 1 ?  endTime : "not Questing"}quest info</Typography>
            </Box>
        )}

        <Box position={"absolute"} top="80%" left="20%">
            <Button onClick={() => NFTARENA_WRITE.startQuest(currentPlayer.tokenId)}>
                Begin Questing
            </Button>
        </Box>
        <Box position={"absolute"}top="80%" left="60%">
            <Button onClick={() => NFTARENA_WRITE.endQuest(currentPlayer.tokenId)}>
                Finish Questing
            </Button>
        </Box>        

      </Box>
    );
}
