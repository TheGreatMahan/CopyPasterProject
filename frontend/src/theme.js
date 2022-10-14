import { createTheme } from "@mui/material/styles";
export default createTheme({
    typography: {
        useNextVariants: true,
    },
    palette:{
        "black":"rgba(0, 4, 255, 1)","white":"rgba(255, 0, 0, 1)"},"background":{"paper":"#fff","default":"#fafafa"},"primary":{"light":"#7986cb","main":"rgba(189, 9, 9, 1)","dark":"#303f9f","contrastText":"#fff"},"secondary":{"light":"#ff4081","main":"rgba(41, 170, 44, 1)","dark":"#c51162","contrastText":"#fff"},"error":{"light":"#e57373","main":"#f44336","dark":"#d32f2f","contrastText":"#fff"},"text":{"primary":"rgba(0, 0, 0, 0.87)","secondary":"rgba(0, 0, 0, 0.54)","disabled":"rgba(0, 0, 0, 0.38)","hint":"rgba(0, 0, 0, 0.38)"
    }
});
