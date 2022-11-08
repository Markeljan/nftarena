import { Box, Typography, Button, CardMedia } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import nftPreview from "/public/nft-preview.gif";

export default function MintPlayer() {
  const { NFTARENA_WRITE, route, setRoute } = useContext(MainContext);

  return (
    <Box display={route === "mint" ? "flex" : "none"} flexDirection={"column"} gap={2}>
      <Typography variant="h5"> Mint Player </Typography>
      <Box
        component="img"
        sx={{
          height: 350,
          width: 350,
        }}
        alt="The house from the offer."
        src={nftPreview}
      />
      <CardMedia src={nftPreview} title="NFT Preview" />

      <Button onClick={() => NFTARENA_WRITE._mintPlayer()} variant="contained">
        Mint
      </Button>
    </Box>
  );
}
