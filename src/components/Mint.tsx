import { Box, Typography, Button } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import { Image } from "mui-image";

export default function MintPlayer() {
  const { NFTARENA_WRITE } = useContext(MainContext);

  return (
    <Box display="flex" flexDirection={"column"} gap={4}>
      <Typography> Mint Player </Typography>
      <Image alt="nft-previews" src="src/assets/nft-preview.gif">
      
      <Button onClick={() => NFTARENA_WRITE._mintPlayer()} variant="contained">
        Mint
      </Button>
    </Box>
  );
}
