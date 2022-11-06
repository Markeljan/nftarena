import { Box, Button, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import CloseIcon from '@mui/icons-material/Close';

export default function Quest({}) {


    const {
        route,
        setRoute,
        show,
        setShow
      } = useContext(MainContext);




    return (
        <Box
        display={show === "quest" ? "flex" : "none"}
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

        <Box position={"absolute"} top="5%" left="40%">
          <Typography fontSize={24}>Time to Quest</Typography>
        </Box>

      </Box>
    );
}
