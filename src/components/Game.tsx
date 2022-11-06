import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import PlayerCard from "./PlayerCard";

export default function Game() {
  const { route, setRoute } = useContext(MainContext);

  return (
    <Box
      display={route === "game" ? "flex" : "none"}
      flexDirection={"column"}
      position={"relative"}
    >
      <Box position={"absolute"} top="0%" left="0%">
        <PlayerCard />
      </Box>
      <Box component="img" width={"100%"} alt="Game Map." src="/src/assets/game-map.jpg" />

      <Box position={"absolute"} top="25%" left="25%">
        <Button variant="contained">Arena 🥊</Button>
      </Box>

      <Box position={"absolute"} top="76%" left="40%">
        <Button variant="contained" onClick={() => setRoute("train")}>
          Train 🏋️‍♂️
        </Button>
      </Box>

      <Box position={"absolute"} top="32%" left="78%">
        <Button variant="contained">Quest 💰</Button>
      </Box>
    </Box>
  );
}
