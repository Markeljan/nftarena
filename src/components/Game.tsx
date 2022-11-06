import { Box, Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import PlayerCard from "./PlayerCard";
import Train from "./Train";
import Quest from "./Quest";
import Arena from "./Arena";


export default function Game() {
  const { route, setRoute } = useContext(MainContext);
  const [show, setShow] = useState("");

  const showContext ={
    show,
    setShow
  }

  
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

      <MainContext.Provider value={showContext}>
        <Train/>
        <Quest/>
        <Arena/>
      </MainContext.Provider>



    </Box>
  );
}
