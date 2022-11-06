import { Box, Typography, Button, CardMedia } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export default function MintPlayer() {
  const { NFTARENA_WRITE, route, setRoute } = useContext(MainContext);

  return (
    <Box display={route === "mint" ? "flex" : "none"} flexDirection={"column"} gap={4}>
      <Typography> Mint Player </Typography>
      <Box
        component="img"
        sx={{
          height: 350,
          width: 350,
        }}
        alt="The house from the offer."
        src="/src/assets/nft-preview.gif"
      />
      <CardMedia src="../assets/nft-preview.gif" title="NFT Previews" />

      <Button onClick={() => NFTARENA_WRITE._mintPlayer()} variant="contained">
        Mint
      </Button>
    </Box>
  );
}
