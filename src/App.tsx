import { useLayoutEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import LoginForm from "./pages/Login/Login";
import PageLayout from "./components/PageLayout";

function App() {
  // ANCHOR STATES && VARS  ||========================================================================
  const [goAhead, setGoAhead] = useState(false);

  // ANCHOR EFFECTS  ||========================================================================
  useLayoutEffect(() => {
    sessionStorage.getItem("username") && setGoAhead(true);
  }, []);

  // ANCHOR JSX  ||========================================================================
  return (
    <Router>
      {goAhead ? (
        <Navbar user={sessionStorage.getItem("username") as string} />
      ) : (
        <Navigate to={"/"} />
      )}
      <Routes>
        <Route path="/">
          <Route
            path="/"
            element={
              goAhead ? (
                <Navigate to="/supplementary" />
              ) : (
                <LoginForm setGoAhead={setGoAhead} />
              )
            }
          />
          <Route
            path="supplementary"
            element={
              <PageLayout>
                <button
                  onClick={() => {
                    setGoAhead(false);
                    sessionStorage.removeItem("username");
                  }}
                >
                  Logout
                </button>
              </PageLayout>
            }
          />
          <Route
            path="cbt"
            element={
              <PageLayout>
                <button
                  onClick={() => {
                    setGoAhead(false);
                    sessionStorage.removeItem("username");
                  }}
                >
                  Hello
                </button>
              </PageLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
