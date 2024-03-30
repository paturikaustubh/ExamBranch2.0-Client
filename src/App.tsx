import { Suspense, lazy, useLayoutEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import PageLayout from "./components/Custom/PageLayout";
import AlertProvider from "./components/Context/AlertDetails";
import { Backdrop, CircularProgress } from "@mui/material";
import LoadingProvider from "./components/Context/Loading";
import Title from "./components/Title";
// import Test from "./misc/Test";

const LoginForm = lazy(() => import("./pages/Login/Login"));
const Reval = lazy(() => import("./pages/Revaluation/Reval"));
const Download = lazy(() => import("./pages/Download/Download"));
const Supple = lazy(() => import("./pages/Supplementary/Supplementary"));
const Upload = lazy(() => import("./pages/Upload/Upload"));
const CBT = lazy(() => import("./pages/CBT/Cbt"));
const ManageUsers = lazy(() => import("./pages/ManageUsers/ManageUsers"));
const ManageCosts = lazy(() => import("./pages/ManageCosts/ManageCosts"));
const Backup = lazy(() => import("./pages/Backup/BackUp"));
const ManageDB = lazy(() => import("./pages/ManageDB/ManageDB"));
const Test = lazy(() => import("./misc/Test"));

function App() {
  // ANCHOR STATES && VARS  ||========================================================================
  const [goAhead, setGoAhead] = useState(false);

  const routes = [
    {
      path: "revaluation",
      element: <Reval />,
    },
    {
      path: "download",
      element: <Download />,
    },
    {
      path: "supplementary",
      element: <Supple />,
    },
    {
      path: "written-test",
      element: <CBT />,
    },
    {
      path: "upload",
      element: <Upload />,
    },
    {
      path: "manage-users",
      element: <ManageUsers />,
    },
    {
      path: "manage-costs",
      element: <ManageCosts />,
    },
    {
      path: "backup-and-restore",
      element: <Backup />,
    },
    {
      path: "manage-database",
      element: <ManageDB />,
    },
    {
      path: "test",
      element: <Test />,
    },
  ];

  // ANCHOR EFFECTS  ||========================================================================
  useLayoutEffect(() => {
    sessionStorage.getItem("username") && setGoAhead(true);
  }, []);

  // ANCHOR JSX  ||========================================================================
  return (
    <Router>
      {goAhead ? (
        <Navbar
          user={sessionStorage.getItem("username") as string}
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
        <LoadingProvider>
          <AlertProvider>
            <Routes>
              <Route path="/">
                <Route
                  path="/"
                  element={
                    goAhead ? (
                      <Navigate
                        to={
                          !sessionStorage.getItem("lastPage") ||
                          sessionStorage.getItem("lastPage") === "undefined"
                            ? "/supplementary"
                            : (sessionStorage.getItem("lastPage") as string)
                        }
                      />
                    ) : (
                      <LoginForm setGoAhead={setGoAhead} />
                    )
                  }
                />
                {routes.map(({ path, element }, indx) => (
                  <Route
                    key={indx}
                    path={path}
                    element={
                      <PageLayout>
                        <Title />
                        {element}
                      </PageLayout>
                    }
                  />
                ))}
              </Route>
            </Routes>
          </AlertProvider>
        </LoadingProvider>
      </Suspense>
    </Router>
  );
}

export default App;
