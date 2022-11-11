import { Box, Button, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import CloseIcon from "@mui/icons-material/Close";
import { useContract } from "wagmi";
import {
  AAVE_APPROVE_ABI,
  AAVE_DATA_ABI,
  AAVE_SUPPLY_ABI,
  AAVE_WITHDRAW_ABI,
} from "../constants/contracts";
import { ethers } from "ethers";

export default function Invest({}) {
  const {
    show,
    setShow,
    NFTARENA_WRITE,
    NFTARENA_READ,
    currentPlayer,
    address,
    signer,
    chain,
    addRecentTransaction,
  } = useContext(MainContext);

  const [suppliedAmount, setSuppliedAmount] = useState(0);
  const [formData, setFormData] = useState({
    amount: "0",
  });

  const AAVE_SUPPLY = useContract({
    address: "0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17",
    abi: AAVE_SUPPLY_ABI,
    signerOrProvider: signer,
  });
  const AAVE_DATA = useContract({
    address: "0x8f57153F18b7273f9A814b93b31Cb3f9b035e7C2",
    abi: AAVE_DATA_ABI,
    signerOrProvider: signer,
  });
  const AAVE_APPROVE = useContract({
    address: "0x89a6ae840b3f8f489418933a220315eea36d11ff",
    abi: AAVE_APPROVE_ABI,
    signerOrProvider: signer,
  });
  const AAVE_WITHDRAW = useContract({
    address: "0x6c9fb0d5bd9429eb9cd96b85b81d872281771e6b",
    abi: AAVE_WITHDRAW_ABI,
    signerOrProvider: signer,
  });

  //get amount deposited on aave
  useEffect(() => {
    const getSuppliedAmount = async () => {
      const getUserReserveData = await AAVE_DATA?.getUserReserveData(
        "0xb685400156cF3CBE8725958DeAA61436727A30c3",
        address
      );
      setSuppliedAmount(getUserReserveData.currentATokenBalance / 10 ** 18);
    };
    signer && getSuppliedAmount();
  }, [signer]);

  const handleSupplyETH = async () => {
    const tx = await AAVE_SUPPLY?.depositETH(
      "0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B",
      address,
      0,
      {
        value: (Number(formData.amount) * 10 ** 18).toString(),
      }
    );
    addRecentTransaction({
      hash: tx.hash,
      description: `Supply ${chain.nativeCurrency.symbol} to Aave`,
    });
  };

  const handleApproveWithdrawETH = async () => {
    let amount = formData.amount as any;
    amount = ethers.utils.parseEther(amount);
    const tx = await AAVE_APPROVE?.approve("0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B", amount);

    addRecentTransaction({
      hash: tx.hash,
      description: `Approve ${chain.nativeCurrency.symbol} withdraw from Aave`,
    });
  };

  const handleWithdrawETH = async () => {
    console.log((Number(formData.amount) * 10 ** 18).toString());
    const tx = await AAVE_WITHDRAW?.withdraw(
      "0xb685400156cF3CBE8725958DeAA61436727A30c3",
      (Number(formData.amount) * 10 ** 18).toString(),
      address
    );
    addRecentTransaction({
      hash: tx.hash,
      description: `Approve Withdraw ${chain.nativeCurrency.symbol} from Aave`,
    });
  };

  return (
    <Box
      display={show === "invest" ? "flex" : "none"}
      flexDirection="column"
      bgcolor="#e3f2fd"
      position={"absolute"}
      top="10%"
      left="19%"
      p={6}
      sx={{ borderRadius: "5%" }}
      gap={4}
    >
      <Box position={"absolute"} top="3%" left="91%">
        <Button onClick={() => setShow(false)} size="medium">
          <CloseIcon />
        </Button>
      </Box>

      <Typography fontSize={24}>Invest on Aave to get AAVE Iron Dagger 🗡️ +2</Typography>
      <Box display="flex" width="100%" justifyContent={"center"}>
        <Box
          component="img"
          src={"https://app.aave.com/icons/tokens/matic.svg"}
          width={"150px"}
          height={"150px"}
        ></Box>
      </Box>
      <TextField
        label="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
      />
      <Box display="flex" gap={4} px={4}>
        <Button onClick={handleSupplyETH} variant="contained">
          Supply {chain.nativeCurrency.symbol}
        </Button>
        <Button onClick={handleApproveWithdrawETH} variant="contained">
          Approve For Withdraw
        </Button>
        <Button onClick={handleWithdrawETH} variant="contained">
          Withdraw {chain.nativeCurrency.symbol}
        </Button>
      </Box>
      <Box>
        <Typography fontSize={24}>
          {suppliedAmount >= 0
            ? "You have invested " +
              suppliedAmount.toString().substring(0, 6) +
              " " +
              chain?.nativeCurrency?.symbol
            : "You have not invested."}
        </Typography>
      </Box>
    </Box>
  );
}
