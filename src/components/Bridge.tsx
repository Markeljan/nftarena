import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import CloseIcon from "@mui/icons-material/Close";
import { useNetwork } from "wagmi";

export default function Bridge({}) {
  const { show, setShow, NFTARENA_WRITE, NFTARENA_READ, currentPlayer, address } =
    useContext(MainContext);
  const { chain } = useNetwork();

  const [arenaStatus, setArenaStatus] = useState(true);
  const [gold, setGold] = useState(0);

  useEffect(() => {
    async function fetchArena() {
      const status = await NFTARENA_READ?.arena();
      setArenaStatus(status[0]);
    }

    async function checkGold() {
      const val = (await NFTARENA_READ?.balanceOf(address, 1)).toNumber();
      setGold(val);
    }

    if (NFTARENA_READ && currentPlayer) {
      fetchArena();
      checkGold();
    }
  }, [NFTARENA_READ, currentPlayer]);

  return (
    <Box
      display={show === "bridge" ? "flex" : "none"}
      flexDirection={"column"}
      width={"80%"}
      height={"80%"}
      bgcolor="#e3f2fd"
      position={"absolute"}
      top="8%"
      left="19%"
      sx={{ borderRadius: "5%" }}
    >
      <Box position={"absolute"} top="3%" left="92%">
        <Button onClick={() => setShow(false)} size="medium">
          <CloseIcon />
        </Button>
      </Box>

      <Box position={"absolute"} top="5%" left="35%">
        <Typography fontSize={24}>Get Ready to Bridge</Typography>
      </Box>

      <Box display="flex" justifyContent="center" alignItems={"center"} height={"100%"}>
        <Button
          disabled={chain?.id === 80001}
          onClick={() => NFTARENA_WRITE.bridgePolygon(currentPlayer.tokenId)}
        >
          Voyage to Polygon
        </Button>
        <Button
          disabled={chain?.id === 420}
          onClick={() => NFTARENA_WRITE.bridgeOptimism(currentPlayer.tokenId)}
        >
          Voyage to Optimism
        </Button>
        <Button
          disabled={chain?.id === 5}
          onClick={() => NFTARENA_WRITE.bridgeGoerli(currentPlayer.tokenId)}
        >
          Voyage to Ethereum
        </Button>
      </Box>
    </Box>
  );
}
