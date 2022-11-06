import { Box, Typography, Button, CardMedia } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export default function MintPlayer() {
  const { NFTARENA_WRITE } = useContext(MainContext);

  return (
    <Box display="flex" flexDirection={"column"} gap={4}>
      <Typography> Mint Player </Typography>

      <CardMedia src="../assets/nft-preview.gif" title="NFT Previews" />

      <Button onClick={() => NFTARENA_WRITE._mintPlayer()} variant="contained">
        Mint
      </Button>
    </Box>
  );
}
