import { Box, Button, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function App() {
  return (
    <>
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
          <Typography> Roboto text test</Typography>
          <Button variant="contained">MUI</Button>
        </Box>

        <Box display={"flex"} justifyContent={"center"} alignItems="center" p={10}>
          <Typography>Built at ETH SF 2022</Typography>
        </Box>
      </Box>
    </>
  );
}
