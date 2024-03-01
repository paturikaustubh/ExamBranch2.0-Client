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

export default function LoginForm({
  setGoAhead,
}: {
  setGoAhead: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // ANCHOR STATES && VARS  ||========================================================================

  const context = useContext(AlertContext);

  const [showPass, setShowPass] = useState(false);
  const [loginCreds, setLoginCreds] = useState<LoginCredentialsProps>({
    username: "",
    password: "",
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

            const resp = await Axios.post(
              `http://localhost:6969/api/login?username=${loginCreds.username}&password=${loginCreds.password}`
            );

            setGoAhead(resp.data.goahead);
            if (!resp.data.goahead)
              context?.showAlert(resp.data.error as string, "error");
            else {
              localStorage.setItem("username", loginCreds.username);
              document.cookie = `Token=${resp.data.token}`;
            }
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
