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
        async function fetchTrain() {
            const time = (await NFTARENA_READ?.arena());
            setArenaStatus(time);
            
        }
        if (NFTARENA_READ && currentPlayer) {
            fetchTrain();
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

        <Box position={"absolute"} top="5%" left="40%">
            <Typography fontSize={24}>Enter the Arena</Typography>
        </Box>

      </Box>
    );
}