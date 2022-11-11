import { Box, Typography } from "@mui/material";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { chainId, useAccount, useContract, useNetwork, useProvider, useSigner } from "wagmi";
import Game from "./components/Game";
import Mint from "./components/Mint";
import Navbar from "./components/Navbar";
import { CONTRACTS, NFTARENA_ABI } from "./constants/contracts";
import { MainContext } from "./contexts/MainContext";
import hyperlane from "/src/assets/hyperlane.png";
import optimism from "/src/assets/optimism.png";
import polygon from "/src/assets/polygon.png";

interface Player {
  tokenId: number;
  uri: string;
  address: string;
  originDomain: number;
  hp: number;
  attack: number;
  status: number;
}

export default function App() {
  const [route, setRoute] = useState("game");
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [userPlayerList, setUserPlayerList] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [show, setShow] = useState("");
  const addRecentTransaction = useAddRecentTransaction();
  const MORALIS_API_KEY = "k0elHqCK8adGJptSKRHRsyp5c6QJXhoCh4ed2dOO9kovfQ2FlXI04XJEQWcr3QjP";

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
    chain,
    signer,
    provider,
    NFTARENA_READ,
    NFTARENA_WRITE,
    currentPlayer,
    setCurrentPlayer,
    userPlayerList,
    show,
    setShow,
    addRecentTransaction,
  };

  useEffect(() => {
    //fetch NFTs using moralis api
    async function fetchNFTs() {
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2/nft/${NFTARENA_ADDRESS}?chain=goerli&format=decimal&normalizeMetadata=false`,
        {
          headers: {
            "x-api-key": MORALIS_API_KEY!,
          },
        }
      );
      const data = await response.json();
      console.log(data);
    }
    fetchNFTs();
  }, []);

  //get array of Players
  useEffect(() => {
    async function fetchPlayers() {
      const playerCount = (await NFTARENA_READ?.playerCount()).toNumber();
      const players = [] as Player[];
      const userPlayers = [] as Player[];
      let player: any[];
      let existingIdsArray = [] as number[];

      for (let i = 0; i < playerCount; i++) {
        existingIdsArray.push((await NFTARENA_READ?.tokenIdsArray(i)).toNumber());
      }

      for (let i = 0; i < existingIdsArray.length; i++) {
        player = await NFTARENA_READ?.players(existingIdsArray[i]);
        const playerObj = {
          tokenId: player[0]?.toNumber(),
          uri: player[1],
          address: player[2],
          originDomain: player[3]?.toNumber(),
          hp: player[4]?.toNumber(),
          attack: player[5]?.toNumber(),
          status: player[6],
        };
        players.push(playerObj);
      }
      players.map((player) => {
        if (player.address === address) {
          userPlayers.push(player);
        }
      });

      setPlayersList(players);
      setUserPlayerList(userPlayers);
      setCurrentPlayer(userPlayers[0]);
    }

    if (NFTARENA_READ) {
      fetchPlayers();
    }
  }, [NFTARENA_WRITE, route]);

  return (
    <MainContext.Provider value={mainContext}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        minHeight={"100vh"}
      >
        <Navbar />

        <Box display={"flex"} flexDirection="column" justifyContent={"center"} alignItems="center">
          <Game />
          <Mint />
        </Box>

        <Box display={"flex"} justifyContent={"center"} alignItems="center" gap={5}>
          <Box
            component="img"
            sx={{
              height: 40,
              width: 40,
            }}
            src={optimism}
          />
          <Box
            component="img"
            sx={{
              height: 40,
              width: 40,
            }}
            src={polygon}
          />

          <Box
            component="img"
            sx={{
              height: 40,
              width: 40,
            }}
            src={hyperlane}
          />
          <Typography>Built at ETH-Global SF 2022</Typography>
        </Box>
      </Box>
    </MainContext.Provider>
  );
}
