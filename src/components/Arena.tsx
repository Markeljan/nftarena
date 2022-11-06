import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import CloseIcon from '@mui/icons-material/Close';

export default function Arena({}) {

    const {
        show,
        setShow,
        NFTARENA_WRITE,
        NFTARENA_READ,
        currentPlayer,
    } = useContext(MainContext);

    const [arenaStatus, setArenaStatus] = useState(true);

    useEffect(() => {      
        async function fetchArena() {
            const status = (await NFTARENA_READ?.arena());
            console.log(status[0]);
            setArenaStatus(status[0]);
        }
        if (NFTARENA_READ && currentPlayer) {
            fetchArena();
        }
    }, [NFTARENA_READ, currentPlayer]);

    return (
        <Box
        display={show === "arena" ? "flex" : "none"}
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

        {currentPlayer && (
            <Box width={"50%"} height={"50%"} position={"absolute"}>
                <Typography fontSize={24}>{arenaStatus ? "arena is open" : "someone is in the arena"}Arena info</Typography>
            </Box>
        )} 

        <Box position={"absolute"} top="80%" left="20%">
            <Button onClick={() => NFTARENA_WRITE.enterArena(currentPlayer.tokenId)}>
                Enter Arena
            </Button>
        </Box>

        <Box position={"absolute"} top="80%" left="60%">
            <Button onClick={() => NFTARENA_WRITE.fightArena(currentPlayer.tokenId)}>
                Accept Challenge 
            </Button>
        </Box>



        <Box position={"absolute"} top="5%" left="40%">
            <Typography fontSize={24}>Welcome to the Arena</Typography>
        </Box>

      </Box>
    );
}