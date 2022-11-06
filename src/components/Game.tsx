import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import PlayerCard from "./PlayerCard";
import Train from "./Train";
import Quest from "./Quest";
import Arena from "./Arena";
import Bridge from "./Bridge";
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';


export default function Game() {
  const { route, setRoute, show, setShow, NFTARENA_WRITE,
    NFTARENA_READ,
    currentPlayer,
    address } = useContext(MainContext);
  const [gold, setGold] = useState(0);

  useEffect(() => {      
    async function checkGold() {
        const val = (await NFTARENA_READ?.balanceOf(address, 1)).toNumber();
        setGold(val)
    }

    if (NFTARENA_READ && currentPlayer) {
        checkGold()
    }
}, [NFTARENA_READ, currentPlayer]);


  return (
    <Box
      display={route === "game" ? "flex" : "none"}
      flexDirection={"column"}
      position={"relative"}
    >
      <Box position={"absolute"} top="1%" left="1%">
        <PlayerCard />
      </Box>
      <Box component="img" width={"100%"} alt="Game Map." src="/src/assets/game-map.jpg" />

      <Box position={"absolute"} top="25%" left="25%">
        <Button variant="contained" onClick={() => setShow("arena")}>Arena 🥊</Button>
      </Box>

      <Box position={"absolute"} top="76%" left="40%">
        <Button variant="contained" onClick={() => setShow("train")}>
          Train 🏋️‍♂️
        </Button>
      </Box>

      <Box position={"absolute"} top="32%" left="78%">
        <Button variant="contained" onClick={() => setShow("quest")}>Quest 💰</Button>
      </Box>

      <Box position={"absolute"} top="52%" left="85%">
        <Button variant="contained" onClick={() => setShow("bridge")}>Bridge 🌊</Button>
      </Box>

      <Box position={"absolute"} top="2%" left="82%" alignItems="center" bgcolor="#e3f2fd"
        width={"15%"} height={"5%"} justifyContent={"center"} display={"flex"} sx={{ borderRadius: "10%" }}
      >
            <Typography fontSize={16}>You Have {gold} Gold 🪙 </Typography>
      </Box>

      <Train/>
      <Quest/>
      <Arena/>
      <Bridge/>




    </Box>
  );
}
