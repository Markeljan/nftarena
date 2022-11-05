import { Box, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import MintPlayer from "./components/MintPlayer";
import { CONTRACTS } from "./constants/contracts";
import { MainContext } from "./contexts/MainContext";

export default function App() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const chainId = chain?.id;

  useEffect(() => {
    console.log("address", address);
    console.log("chain", chainId);
    console.log(CONTRACTS[chainId?]);
  }, []);
  return (
    <MainContext.Provider value={CONTRACTS}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        p={2}
        minHeight={"100vh"}
      >
        <Box display={"flex"} alignItems="right" justifyContent={"right"}>
          <ConnectButton />
        </Box>
        <Box
          display={"flex"}
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          gap={5}
        >
          <MintPlayer />
        </Box>

        <Box display={"flex"} justifyContent={"center"} alignItems="center" p={10}>
          <Typography>Built at ETH SF 2022</Typography>
        </Box>
      </Box>
    </MainContext.Provider>
  );
}
