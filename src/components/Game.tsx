import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export default function GameMap() {
  const {
    setShowTavern,
    showTavern,
    showQuests,
    setShowQuests,
    buttonBackground,
    selectedNFTEl,
    buttonHoverBackground,
    buttonActiveBackground,
  } = useContext(MainContext);

  return (
    <Box
      hidden={showTavern || showQuests ? true : false}
      display="flex"
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
