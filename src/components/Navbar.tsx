import { Box, Button } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export default function Header() {
  const { setRoute } = useContext(MainContext);

  return (
    <Box
      display={"flex"}
      justifyContent="right"
      alignItems="center"
      width="100%"
      bgcolor={"white"}
      p={3}
    >
      <Box display={"flex"} minWidth={{ xs: "40%" }}>
        <Button onClick={() => setRoute("mint")} size="large">
          Mint
        </Button>
        <Button onClick={() => setRoute("game")} size="large">
          Game
        </Button>
      </Box>
      <Box mr={{ xs: 2, md: 10, lg: 15, xl: 20 }}>
        <ConnectButton />
      </Box>
    </Box>
  );
}
