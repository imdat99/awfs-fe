import { createRoot } from "react-dom/client";
import {
    CssBaseline,
    StyledEngineProvider,
} from "@mui/material";
import Layout from "Layout";
import Problem from "Problem";

createRoot(document.getElementById("root")!).render(
    <StyledEngineProvider injectFirst>
        <CssBaseline />
        <Layout>
            <Problem />
        </Layout>
    </StyledEngineProvider>
);
