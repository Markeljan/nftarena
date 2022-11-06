import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export default function PlayerCard() {
  const { currentPlayer, setCurrentPlayer, userPlayerList } = useContext(MainContext);

  console.log("usersList", userPlayerList);

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
              <Typography fontSize={14}>🛡️ {currentPlayer.status}</Typography>
            </Box>
            <Typography fontSize={14}>Nomad {currentPlayer.tokenId}</Typography>
            <Typography fontSize={14}>Address: {currentPlayer.address.substring(0, 6)}</Typography>
            <Typography fontSize={14}>
              Origin:{" "}
              {currentPlayer.originDomain === 0
                ? "Optimism"
                : currentPlayer.originDomain === 1
                ? "Polygon"
                : "Ethereum"}
            </Typography>
            {/* left and right buttons to iterate through suersPlayers */}

            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography
                fontSize={14}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  // if currentplayer index is the first player in the currentPlayerlist array, set current player to the last player in the list
                  if (userPlayerList.findIndex(currentPlayer) === 0) {
                    setCurrentPlayer(userPlayerList[userPlayerList.length - 1]);
                  } else {
                    // else set current player to the player before the current player
                    setCurrentPlayer(userPlayerList[userPlayerList.findIndex(currentPlayer) - 1]);
                  }
                }}
              >
                {"<"}
              </Typography>
              <Typography
                fontSize={14}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (currentPlayer.tokenId === playersList.length) {
                    setCurrentPlayer(playersList[0]);
                  } else {
                    setCurrentPlayer(playersList[currentPlayer.tokenId]);
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
