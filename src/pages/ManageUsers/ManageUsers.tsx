import React, { useState } from "react";
import Axios from "axios";
import {
  Alert,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  Button,
  FormControlLabel,
} from "@mui/material";

import HelpIcon from "@mui/icons-material/Help";

// interface AddUserProps {
//   ip: string;
// }

// const AddUser: React.FC<AddUserProps> = ({ ip }) => {
const ManageUsers = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [delName, setDelName] = useState("");
  const [added, setAdded] = useState(false);
  const [existed, setExisted] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [action, setAction] = useState<"add" | "delete">("add");
  const [showPass, setShowPass] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  return (
    <Container maxWidth="xl">
      <title>Manage Users</title>
      <Grid container display={"flex"} justifyContent="center" mb={4}>
        <Typography
          variant="h3"
          component="span"
          fontWeight="600"
          color="info.main"
        >
          Manage Users
          <Tooltip title="Help">
            <IconButton
              size="large"
              onClick={() => {
                setOpenHelp(true);
              }}
              color="primary"
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Typography>
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            select
            label="Action"
            style={{
              backgroundColor: "white",
            }}
            onChange={(e) => {
              setAction(e.target.value as "add" | "delete");
            }}
            value={action}
          >
            <MenuItem value={"add"}>Add User</MenuItem>
            <MenuItem value={"delete"}>Delete User</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Container maxWidth="md">
        <Paper style={{ padding: "4%" }}>
          {action === "add" && (
            <>
              <Grid container spacing={1} mb={4}>
                <Grid item>
                  <Typography
                    variant="h3"
                    color="primary.main"
                    fontWeight={500}
                  >
                    Add User
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1} mb={4}>
                <Grid item xs={12}>
                  <Typography variant="h6">Enter Username</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    error={userName.length > 15}
                    placeholder="Username"
                    style={{ backgroundColor: "white" }}
                    autoFocus
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} mb={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">Enter Password</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    disabled={userName === "" || userName.length > 15}
                    type={showPass ? "text" : "password"}
                    error={password !== cpassword && cpassword.length > 0}
                    value={password}
                    color={
                      password === cpassword &&
                      password.length > 0 &&
                      cpassword.length > 0
                        ? "success"
                        : "primary"
                    }
                    placeholder="Password"
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} mb={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    disabled={userName === "" || userName.length > 15}
                    type={showPass ? "text" : "password"}
                    error={password !== cpassword && cpassword.length > 0}
                    value={cpassword}
                    color={
                      password === cpassword &&
                      password.length > 0 &&
                      cpassword.length > 0
                        ? "success"
                        : "primary"
                    }
                    placeholder="Confirm Password"
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => {
                      setCPassword(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      label="Show Password"
                      control={
                        <Checkbox
                        //   onClick={(e) => {
                        //     if (e.target.checked) {
                        //       setShowPass(true);
                        //     } else setShowPass(false);
                        //   }}
                        />
                      }
                    ></FormControlLabel>
                  </FormGroup>
                </Grid>
                <Grid item xs={12} textAlign={"right"} mt={2}>
                  <Button
                    size="large"
                    disabled={
                      userName === "" ||
                      password !== cpassword ||
                      password === ""
                    }
                    variant="contained"
                    type="submit"
                    // onClick={() => {
                    //   if (password === cpassword) {
                    //     Axios.post(`http://${ip}:6969/AddUser`, {
                    //       userName: userName,
                    //       password: password,
                    //     }).then((resp) => {
                    //       if (resp.data["Valid"]) {
                    //         setAdded(true);
                    //         setUserName("");
                    //         setPassword("");
                    //         setCPassword("");
                    //       } else {
                    //         setExisted(true);
                    //       }
                    //     });
                    //   } else {
                    //     setWrongPass(true);
                    //   }
                    // }}
                  >
                    Add User
                  </Button>
                </Grid>
              </Grid>
            </>
          )}

          {action === "delete" && (
            <>
              <Grid container spacing={1} mb={4}>
                <Grid item>
                  <Typography variant="h3" color="error.main" fontWeight={500}>
                    Delete User
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={1} mb={2} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6">Enter Username</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={delName}
                    autoFocus
                    placeholder="Username"
                    style={{ backgroundColor: "white" }}
                    onChange={(e) => {
                      setDelName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} textAlign={"right"}>
                  <Button
                    size="large"
                    color="error"
                    variant="contained"
                    disabled={delName === "" || delName === "admin"}
                    // onClick={() => {
                    //   Axios.post(`http://${ip}:6969/DelUser`, {
                    //     userName: delName,
                    //   }).then((resp) => {
                    //     if (resp.data["done"]) {
                    //       setDeleted(true);
                    //       setDelName("");
                    //     }
                    //   });
                    // }}
                  >
                    Delete User
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      </Container>

      <Dialog
        sx={{ backdropFilter: "blur(1px)" }}
        open={openHelp}
        onClose={() => setOpenHelp(false)}
      >
        <DialogTitle
          justifyContent={"space-between"}
          display="flex"
          alignItems={"center"}
        >
          <Typography variant="h3" color="primary.main" fontWeight={600}>
            Manage Users
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText textAlign="justify" fontWeight={500}>
            <h2 className="help">
              <>Overview</>
            </h2>
            <p>You can either add/delete users from the database.</p>
            <Divider />
            <br />
            <h2 className="help">
              <>Parameters</>
            </h2>
            <p>
              <span className="helpHead">Username</span> - Username that you
              wnat to add/delete
            </p>
            <p>
              <span className="helpHead">Password</span> - Password for that
              user. This should be unique to all the users
            </p>
            <p>
              <Typography
                variant="h5"
                component={"span"}
                color="error"
                fontWeight={500}
              >
                Do not share your password with anyone other than department
                staff.
              </Typography>
            </p>
            <Divider />
            <br />
            <h2 className="help">
              <>Procedure</>
            </h2>
            <p>
              If you want to add a user, select <code>Add User</code> from the{" "}
              <code>Action</code> menu. Then, enter their userName and password.
              You must confirm your password by re-entering it for a second
              time, and then click <code>Add User</code> button.
            </p>
            <p>
              If you want to delete a user, select <code>Delete User</code> from
              the <code>Action</code> menu. Then enter the userName and click{" "}
              <code>Delete</code> button.
            </p>
            <Divider />
            <br />
            <h2 className="help">
              <>Exceptions</>
            </h2>
            <p>
              If you want to change your password, you first need to delte your
              account from <code>Delete User</code> tab and create a new one
              from <code>Add User</code> tab.
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenHelp(false);
            }}
          >
            okay
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={added}
        onClose={() => {
          setAdded(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2500}
      >
        <Alert
          severity="success"
          variant="standard"
          onClose={() => {
            setAdded(false);
          }}
        >
          {`User added successfully`}
        </Alert>
      </Snackbar>

      <Snackbar
        open={existed}
        onClose={() => {
          setExisted(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2500}
      >
        <Alert
          severity="warning"
          variant="standard"
          onClose={() => {
            setExisted(false);
          }}
        >
          {`${userName} already exists`}
        </Alert>
      </Snackbar>

      <Snackbar
        open={wrongPass}
        onClose={() => {
          setWrongPass(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2500}
      >
        <Alert
          severity="error"
          variant="standard"
          onClose={() => {
            setWrongPass(false);
          }}
        >
          Incorrect credentials
        </Alert>
      </Snackbar>

      <Snackbar
        open={deleted}
        onClose={() => {
          setDeleted(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2500}
      >
        <Alert
          severity="success"
          variant="standard"
          onClose={() => {
            setDeleted(false);
          }}
        >
          {`Deleted user`}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageUsers;
