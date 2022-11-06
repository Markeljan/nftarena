import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export default function Game() {
  const {
    route,
    setRoute
  } = useContext(MainContext);

  return (
    <Box
      display={route === "game" ? "flex" : "none"}
      flexDirection={"column"}
      position={"relative"}
    >
      <Box component="img" width={"100%"} alt="Game Map." src="/src/assets/game-map.jpg" />
      {/* <Box
        p={3}
        m={1}
        borderRadius="2xl"
        position={"absolute"}
      >
        {selectedNFTEl}
      </Box>
   */}
      <Box position={"absolute"} top="25%" left="25%">
        <Button variant="contained">Arena 🥊</Button>
      </Box>
      
      <Box position={"absolute"} top="76%" left="40%">
        <Button variant="contained">Train 🏋️‍♂️</Button>
      </Box>

      <Box position={"absolute"} top="32%" left="78%">
        <Button variant="contained">Quest 💰</Button>
      </Box>




      {/*
      </Link>
      <Button
        onClick={() => setShowQuests(!showQuests)}
        fontSize={"20px"}
        position={"absolute"}
        top="25%"
        left="75%"
        background={buttonBackground}
        opacity="0.9"
        _hover={{ background: buttonHoverBackground }}
        _active={{ background: buttonActiveBackground }}
        p="2, 4"
        rounded="md"
      >
        Quest 💰
      </Button>

      <Link href="https://docs.daoscape.one/home/gameplay/training" isExternal>
        <Button
          fontSize={"20px"}
          position={"absolute"}
          top="80%"
          left="40%"
          background={buttonBackground}
          opacity="0.9"
          _hover={{ background: buttonHoverBackground }}
          _active={{ background: buttonActiveBackground }}
          p="2, 4"
          rounded="md"
        >
          Training 🏋️‍♂️
        </Button>
      </Link>

      <Button
        onClick={() => setShowTavern(!showTavern)}
        fontSize={"20px"}
        position={"absolute"}
        top="55%"
        left="62%"
        background={buttonBackground}
        opacity="0.9"
        _hover={{ background: buttonHoverBackground }}
        _active={{ background: buttonActiveBackground }}
        p="2, 4"
        rounded="md"
      >
        Tavern 🍻
      </Button>

      <Link href="https://docs.daoscape.one/home/gameplay/combat" isExternal>
        <Button
          fontSize={"20px"}
          position={"absolute"}
          top="45%"
          left="82%"
          background={buttonBackground}
          opacity="0.9"
          _hover={{ background: buttonHoverBackground }}
          _active={{ background: buttonActiveBackground }}
          p="2, 4"
          rounded="md"
        >
          Wilderness ☠
        </Button>
      </Link> */}
    </Box>
  );
}
