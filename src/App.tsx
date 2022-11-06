import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount, useContract, useNetwork, useProvider, useSigner } from "wagmi";
import Game from "./components/Game";
import Mint from "./components/Mint";
import Navbar from "./components/Navbar";
import { CONTRACTS, NFTARENA_ABI } from "./constants/contracts";
import { MainContext } from "./contexts/MainContext";

export default function App() {
  const [route, setRoute] = useState("game");
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const chainName = chain?.name;
  const NFTARENA_ADDRESS = CONTRACTS[chainName as keyof typeof CONTRACTS];

  const NFTARENA_READ = useContract({
    address: NFTARENA_ADDRESS,
    abi: NFTARENA_ABI,
    signerOrProvider: provider,
  });
  const NFTARENA_WRITE = useContract({
    address: NFTARENA_ADDRESS,
    abi: NFTARENA_ABI,
    signerOrProvider: signer,
  });

  const mainContext = {
    route,
    setRoute,
    address,
    NFTARENA_READ,
    NFTARENA_WRITE,
  };

  useEffect(() => {
    console.log("chain:", chain?.name);
    console.log("chainName:", chainName);
    console.log(CONTRACTS[chainName as keyof typeof CONTRACTS]);
  }, [chainName]);
  return (
    <MainContext.Provider value={mainContext}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        p={2}
        minHeight={"100vh"}
      >
        <Navbar />

        <Box
          display={"flex"}
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          gap={5}
        >
          {route === "game" ? <Game /> : <Mint />}
        </Box>

        <Box display={"flex"} justifyContent={"center"} alignItems="center" p={10}>
          <Typography>Built at ETH SF 2022</Typography>
        </Box>
      </Box>
    </MainContext.Provider>
  );
}
