import { useState, useContext } from "react";

import {
  TextField,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { PersonOutlineOutlined, VpnKeyOutlined } from "@mui/icons-material";

import { AlertContext } from "../../components/Context/AlertDetails";

import Logo from "/assets/Logo.png";
import Axios from "axios";
import { LoadingContext } from "../../components/Context/Loading";

export default function LoginForm({
  setGoAhead,
}: {
  setGoAhead: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // ANCHOR STATES && VARS  ||========================================================================

  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  const [showPass, setShowPass] = useState(false);
  const [loginCreds, setLoginCreds] = useState<LoginCredentialsProps>({
    username: "",
    password: "",
    displayName: "",
  });

  // ANCHOR JSX  ||========================================================================
  return (
    <div className="h-[100dvh] flex justify-center items-center gap-10">
      <div className="fixed top-10"></div>
      <div className="flex items-center justify-around gap-60 bg-white w-[80%] py-7 pr-10 lg:pl-24 md:pl-12 pl-2 rounded-lg">
        <img
          src={Logo}
          alt="College Logo"
          className="hidden lg:block size-52"
        />
        <div className="flex flex-col items-center grow justify-center h-fit lg:gap-28 gap-14 lg:p-4 p-2">
          <div className="lg:text-7xl md:text-6xl text-5xl font-semibold text-blue-700">
            Welcome!
          </div>

          {/* Login form */}
          <form
            className="flex flex-col gap-6 w-full items-center"
            onSubmit={async (e) => {
              e.preventDefault();
              loading?.showLoading(true);

              Axios.post(`api/login`, {
                withCredentials: true,
                username: loginCreds.username,
                password: loginCreds.password,
              })
                .then(({ data }) => {
                  setGoAhead(data.goahead);
                  if (!data.goahead)
                    alert?.showAlert(data.error as string, "error");
                  else {
                    sessionStorage.setItem("username", loginCreds.username);
                    sessionStorage.setItem("displayName", data.displayName);
                    document.cookie = `Token=${data.token}`;
                  }
                })
                .finally(() => loading?.showLoading(false));
            }}
          >
            <TextField
              autoFocus
              fullWidth
              type="outlined"
              value={loginCreds.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlined />
                  </InputAdornment>
                ),
              }}
              label="Username"
              onChange={({ target: { value } }) =>
                setLoginCreds((prevVals) => ({ ...prevVals, username: value }))
              }
            />
            <TextField
              fullWidth
              type={showPass ? "text" : "password"}
              variant="outlined"
              value={loginCreds.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyOutlined />
                  </InputAdornment>
                ),
              }}
              label="Password"
              onChange={({ target: { value } }) =>
                setLoginCreds((prevVals) => ({ ...prevVals, password: value }))
              }
            />
            <div className="flex justify-between items-center w-full">
              <FormGroup sx={{ marginRight: "auto" }}>
                <FormControlLabel
                  label="Show password"
                  control={
                    <Checkbox onClick={() => setShowPass((prev) => !prev)} />
                  }
                />
              </FormGroup>
              <button
                type="submit"
                className="bg-blue-700 px-4 py-2 text-white rounded-md ml-auto lg:text-xl md:text-lg text-base duration-300"
                disabled={
                  loginCreds.username.length === 0 ||
                  loginCreds.password.length < 4
                }
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
