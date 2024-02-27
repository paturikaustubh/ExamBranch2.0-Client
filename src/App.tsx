import { Suspense, lazy, useLayoutEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import PageLayout from "./components/PageLayout";
import AlertProvider from "./components/Context/AlertDetails";
import { Backdrop, CircularProgress } from "@mui/material";

const LoginForm = lazy(() => import("./pages/Login/Login"));
const Supple = lazy(() => import("./pages/Revaluation/Reval"));

function App() {
  // ANCHOR STATES && VARS  ||========================================================================
  const [goAhead, setGoAhead] = useState(false);

  const routes = [
    {
      path: "supplementary",
      element: <Supple />,
    },
  ];

  // ANCHOR EFFECTS  ||========================================================================
  useLayoutEffect(() => {
    localStorage.getItem("username") && setGoAhead(true);
  }, []);

  // ANCHOR JSX  ||========================================================================
  return (
    <Router>
      {goAhead ? (
        <Navbar
          user={localStorage.getItem("username") as string}
          setGoAhead={setGoAhead}
        />
      ) : (
        <Navigate to={"/"} />
      )}
      <Suspense
        fallback={
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        <Routes>
          <Route path="/">
            <Route
              path="/"
              element={
                goAhead ? (
                  <Navigate to="/supplementary" />
                ) : (
                  <div>
                    <AlertProvider>
                      <LoginForm setGoAhead={setGoAhead} />
                    </AlertProvider>
                  </div>
                )
              }
            />
            {routes.map(({ path, element }, indx) => (
              <Route
                key={indx}
                path={path}
                element={<PageLayout>{element}</PageLayout>}
              />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
