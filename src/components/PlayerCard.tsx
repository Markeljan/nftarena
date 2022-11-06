import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export default function PlayerCard() {
  const { playersList, currentPlayer, setCurrentPlayer } = useContext(MainContext);

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
          alt="The house from the offer."
          src="/src/assets/nft-preview.gif"
        />
        <Box sx={{ opacity: 1 }} display="flex" flexDirection="column" gap={2}>
          <Typography>Player Name</Typography>
          <Typography>Player Level</Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography>Player Wins</Typography>
        <Typography>Player Losses</Typography>
      </Box>
    </Box>
  );
}
