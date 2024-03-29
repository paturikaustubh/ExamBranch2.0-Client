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
    <div className="grid lg:grid-cols-2 grid-cols-1 justify-center items-center h-[100dvh] lg:p-6 md:p-4 p-2">
      <img src={Logo} alt="College Logo" className="mx-auto hidden lg:block" />
      <div className="flex flex-col items-center justify-center w-full h-fit bg-white lg:gap-28 gap-14 lg:p-4 p-2 rounded-md">
        <div className="lg:text-7xl md:text-6xl text-5xl font-semibold text-blue-700">
          Welcome!
        </div>

        {/* Login form */}
        <form
          className="flex flex-col gap-6 w-full items-center"
          onSubmit={async (e) => {
            e.preventDefault();
            loading?.showLoading(true);

            Axios.post(
              `api/login?username=${loginCreds.username}&password=${loginCreds.password}`,
              {
                username: loginCreds.username,
                password: loginCreds.password,
                withCredentials: true,
              }
            )
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
              ></FormControlLabel>
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
  );
}
