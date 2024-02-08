import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "react-hot-toast";

import ExperimentRecordsPage from "pages/ExperimentRecordsPage";
import ExperimentDetailsPage from "pages/ExperimentDetailsPage";
import DrawerLayout from "components/templates/drawerLayout";
import { client } from "API/apolloClientConfig";
import { cssVariableTheme } from "theme";
import SettingsPage from "pages/SettingsPage";
function App() {
  const themeConfig = extendTheme(cssVariableTheme);
  return (
    <ApolloProvider client={client}>
      <CssVarsProvider theme={themeConfig}>
        <CssBaseline />
        {/* main page */}
        <BrowserRouter>
          <DrawerLayout>
            <Routes>
              <Route
                path="/"
                element={<Navigate replace to="/aqd/experiments" />}
              />
              <Route path="/aqd/experiments" element={<ExperimentRecordsPage />} />
              <Route
                path="/aqd/experiments/favourites"
                element={<ExperimentRecordsPage category="favourites" />}
              />
              <Route
                path="/aqd/experiments/archived"
                element={<ExperimentRecordsPage category="archived" />}
              />
              <Route
                path="/aqd/experiments/:experimentIdentifier"
                element={<ExperimentDetailsPage />}
              />
              <Route
                path="/settings"
                element={<SettingsPage />}
              />
            </Routes>
          </DrawerLayout>
          <Toaster />
        </BrowserRouter>
      </CssVarsProvider>
    </ApolloProvider>
  );
}

export default App;
