import { Box, Button } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function App() {
  return (
    <>
      <Box display={"flex"} justifyContent={"center"} alignItems="center" p={2} minHeight={"100vh"}>
        <ConnectButton />
        <Box display={"flex"} justifyContent={"center"} alignItems="center" p={2}>
          <Button variant="contained">MUI</Button>
        </Box>
      </Box>
    </>
  );
}
