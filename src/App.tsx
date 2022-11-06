import { Box, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers, providers } from "ethers";
import { useEffect } from "react";
import { useAccount, useContract, useNetwork, useProvider, useSigner } from "wagmi";
import Mint from "./components/Mint";
import { CONTRACTS, NFTARENA_ABI } from "./constants/contracts";
import { MainContext } from "./contexts/MainContext";

export default function App() {
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

  useEffect(() => {
    console.log("chain:", chain?.name);
    console.log("chainName:", chainName);
    console.log(CONTRACTS[chainName as keyof typeof CONTRACTS]);
  }, [chainName]);
  return (
    <MainContext.Provider value={{ NFTARENA_READ, NFTARENA_WRITE }}>
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
          <Mint />
        </Box>

        <Box display={"flex"} justifyContent={"center"} alignItems="center" p={10}>
          <Typography>Built at ETH SF 2022</Typography>
        </Box>
      </Box>
    </MainContext.Provider>
  );
}
