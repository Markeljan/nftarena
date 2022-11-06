import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount, useContract, useNetwork, useProvider, useSigner } from "wagmi";
import Game from "./components/Game";
import Mint from "./components/Mint";
import Train from "./components/Train";
import Navbar from "./components/Navbar";
import { CONTRACTS, NFTARENA_ABI } from "./constants/contracts";
import { MainContext } from "./contexts/MainContext";

interface Player {
  address: string;
  hp: number;
  attack: number;
  status: number;
}

export default function App() {
  const [route, setRoute] = useState("game");
  const [playersList, setPlayersList] = useState<Player[]>([]);
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

  //get array of Players
  useEffect(() => {
    async function fetchPlayers() {
      const playerCount = await NFTARENA_READ?.playerCount();
      const players = [];
      let player;

      for (let i = 1; i <= playerCount; i++) {
        player = await NFTARENA_READ?.players(i);
        players.push(player);
      }
      setPlayersList(players);
    }

    if (NFTARENA_READ) {
      fetchPlayers();
    }
  }, [NFTARENA_READ]);

  useEffect(() => {
    console.log("playersList", playersList);
  }, [playersList]);

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
          <Game />
          <Mint />
          <Train />
        </Box>

        <Box display={"flex"} justifyContent={"center"} alignItems="center" p={10}>
          <Typography>Built at ETH SF 2022</Typography>
        </Box>
      </Box>
    </MainContext.Provider>
  );
}
