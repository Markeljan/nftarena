import { Box, Typography, Button, CardMedia } from "@mui/material";

export default function MintPlayer() {
  return (
    <Box display="flex" flexDirection={"column"} gap={4}>
      <Typography> Mint Player </Typography>
      <Box component="img" width={"100%"} alt="Game Map." src="/src/assets/game-map.jpg" />
    </Box>
  );
}
