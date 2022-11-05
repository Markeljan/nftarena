import { Box, Button, Typography } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function App() {
  return (
    <>
      <Box display={"flex"} justifyContent={"center"} alignItems="center" p={2} minHeight={"100vh"}>
        <ConnectButton />
        <Box display={"flex"} justifyContent={"center"} alignItems="center" p={2}>
          <Button variant="contained">MUI</Button>
          <Typography> Roboto text test</Typography>
        </Box>
      </Box>
    </>
  );
}
