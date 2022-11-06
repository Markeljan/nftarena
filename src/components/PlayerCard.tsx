import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export default function PlaerCard() {
  const { playersList } = useContext(MainContext);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="white"
      p={3}
    >
      <Box display="flex" flexDirection="column" gap={3}>
        <Box
          component="img"
          sx={{
            height: 100,
            width: 100,
          }}
          alt="The house from the offer."
          src="/src/assets/nft-preview.gif"
        />
        <Box display="flex" flexDirection="column" gap={2}>
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
