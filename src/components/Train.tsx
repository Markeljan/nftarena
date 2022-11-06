import { Box, Button, Typography } from "@mui/material";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export default function Train() {
    const {
        route,
        setRoute
      } = useContext(MainContext);

    return (
        <Box       
            display={route === "train" ? "flex" : "none"}
            flexDirection={"column"}
            position={"relative"}
            >

            <Box display={"flex"} justifyContent={"center"} alignItems="center" p={10}>
                <Typography>We are going be training here</Typography>
            </Box>


        </Box>
    );
}

