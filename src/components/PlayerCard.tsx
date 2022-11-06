import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export default function PlayerCard() {
  const { currentPlayer, setCurrentPlayer, userPlayerList } = useContext(MainContext);
  const currentPlayerIndex = userPlayerList.indexOf(currentPlayer);


  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="#e3f2fd"
      p={3}
      sx={{ borderRadius: "10%" }}
    >
      <Box sx={{ opacity: 1 }} display="flex" flexDirection="column" gap={3}>
        <Box
          component="img"
          sx={{ opacity: 1, height: 120, width: 120 }}
          alt="NFT image."
          src={currentPlayer && currentPlayer.uri}
        />
        {currentPlayer && (
          <Box sx={{ opacity: 1 }} display="flex" flexDirection="column">
            <Box display="flex" gap={1}>
              <Typography fontSize={14}>❤️ {currentPlayer.hp}</Typography>
              <Typography fontSize={14}>🗡️ {currentPlayer.attack}</Typography>
            </Box>
            <Typography fontSize={14}>Nomad {currentPlayer.tokenId}</Typography>
            <Typography fontSize={14}>Address: {currentPlayer.address.substring(0, 6)}</Typography>
            <Typography fontSize={14}>
              Origin:{" "}
              {currentPlayer.originDomain === 80001
                ? "Polygon"
                : currentPlayer.originDomain === 420
                ? "Optimism"
                : "Ethereum"}
            </Typography>
            <Typography fontSize={14}>
              Status:{" "}
              {currentPlayer.status === 0
                ? "idle..."
                : currentPlayer.status === 1
                ? "questing..."
                : "training..."}
            </Typography>

            <Box display="flex" justifyContent="space-between" width="100%" pt={1}>
              <Typography
                fontSize={24}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (currentPlayerIndex === 0) {
                    setCurrentPlayer(userPlayerList[userPlayerList.length - 1]);
                  } else {
                    setCurrentPlayer(userPlayerList[currentPlayerIndex - 1]);
                  }
                }}
              >
                {"<"}
              </Typography>
              <Typography
                fontSize={24}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (currentPlayerIndex === userPlayerList.length - 1) {
                    setCurrentPlayer(userPlayerList[0]);
                  } else {
                    setCurrentPlayer(userPlayerList[currentPlayerIndex + 1]);
                  }
                }}
              >
                {">"}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
