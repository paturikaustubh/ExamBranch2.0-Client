import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
  Typography,
  Table,
  TableRow,
  TableCell,
  Paper,
  TableHead,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  DialogTitle,
  Divider,
  Backdrop,
  CircularProgress,
  Container,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Alert, Snackbar } from "@mui/material";
// import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers";
import HelpIcon from "@mui/icons-material/Help";

// const Costs: React.FC<{ ip: string }> = ({ ip }) => {
  const Costs = () => {
  const [supBase, setSupBase] = useState<number>();
  const [supAdd, setSupAdd] = useState<number>();
  const [supMax, setSupMax] = useState<number>();
  const [reval, setReval] = useState<number>();
  const [cbtBase, setCbtBase] = useState<number>();
  const [cbtAdd, setCbtAdd] = useState<number>();
  const [cbtMax, setCbtMax] = useState<number>();
  const [openCosts, setOpenCosts] = useState(false);
  const [openFine, setOpenFine] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fine_1, setFine_1] = useState<number>();
  const [fine_2, setFine_2] = useState<number>();
  const [fine_3, setFine_3] = useState<number>();
  const [fine_1Dt, setFine_1Dt] = useState<string>("");
  const [fine_2Dt, setFine_2Dt] = useState<string>("");
  const [fine_3Dt, setFine_3Dt] = useState<string>("");
  const [noFine, setNoFine] = useState<string>("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [fillAlert, setFillAlert] = useState(false);
  const [costVariant, setCostVariant] = useState("outlined");
  const [fineVariant, setFineVariant] = useState("outlined");
  const [fineDone, setFineDone] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  let colNames: string[] = ["Exam", "Base Cost", "Additional Cost", "Max Cost"];
  let tabData: {
    name: string;
    baseCost: number | undefined;
    addCost: number | undefined;
    maxCost: number | undefined;
  }[] = [
    {
      name: "Supplementary",
      baseCost: supBase,
      addCost: supAdd,
      maxCost: supMax,
    },
    {
      name: "Re-Evaluation",
      baseCost: reval,
      addCost: undefined,
      maxCost: undefined,
    },
    {
      name: "Written Test",
      baseCost: cbtBase,
      addCost: cbtAdd,
      maxCost: cbtMax,
    },
  ];

  const handleClickOpen = () => {
    setOpenCosts(true);
  };

  const handleClose = () => {
    setOpenFine(false);
    setOpenCosts(false);
  };

//   useEffect(() => {
//     Axios.post<{ arr: any[] }>(`http://${ip}:6969/getCosts`).then((resp) => {
//       console.log(resp.data);
//       setSupBase(resp.data.arr[0].sbc);
//       setSupAdd(resp.data.arr[0].sac);
//       setSupMax(resp.data.arr[0].sfc);
//       setReval(resp.data.arr[0].rev);
//       setCbtBase(resp.data.arr[0].cbc);
//       setCbtAdd(resp.data.arr[0].cac);
//       setCbtMax(resp.data.arr[0].cfc);
//       setFine_1(resp.data.arr[0].fine_1);
//       setFine_2(resp.data.arr[0].fine_2);
//       setFine_3(resp.data.arr[0].fine_3);
//       setFine_1Dt(dayjs(resp.data.arr[0].fine_1Dt));
//       setFine_2Dt(dayjs(resp.data.arr[0].fine_2Dt));
//       setFine_3Dt(dayjs(resp.data.arr[0].fine_3Dt));
//       setNoFine(dayjs(resp.data.arr[0].no_fine));
//     });
//   }, [ip]);

  let tsbc = supBase;
  let tsac = supAdd;
  let tsmc = supMax;
  let trev = reval;
  let tcbc = cbtBase;
  let tcac = cbtAdd;
  let tcmc = cbtMax;
  let tf1 = fine_1;
  let tf2 = fine_2;
  let tf3 = fine_3;
  let tf1dt = fine_1Dt;
  let tf2dt = fine_2Dt;
  let tf3dt = fine_3Dt;
  let tnofine = noFine;

  return (
    <Container>
      <title>Costs</title>
      <Grid
        container
        display={"flex"}
        justifyContent="center"
        mb={4}
        alignItems="center"
      >
        <Typography
          variant="h3"
          component="span"
          fontWeight="600"
          color="info.main"
        >
          Manage Costs
          <Tooltip title="Help">
            <IconButton
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

      {/* =========================================||  TABLE  ||========================================= */}
      <Paper
        elevation={4}
        sx={{
          overflow: "auto",
          padding: 2,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            {colNames.map((col, indx) => (
              <TableCell
                key={indx}
                align="center"
                sx={{ backgroundColor: "#dadada" }}
              >
                <h3>
                  <>{col}</>
                </h3>
              </TableCell>
            ))}
          </TableHead>

          {tabData.map((data, indx) => (
            <TableRow hover key={indx}>
              <TableCell align="center">
                <h3>
                  <>{data.name}</>
                </h3>
              </TableCell>
              <TableCell align="center">{data.baseCost}</TableCell>
              <TableCell align="center">{data.addCost}</TableCell>
              <TableCell align="center">{data.maxCost}</TableCell>
            </TableRow>
          ))}
        </Table>
        <Grid container justifyContent="flex-end" spacing={2} mt={2}>
          <Grid item>
            <Button
              onClick={handleClickOpen}
              onMouseEnter={() => setCostVariant("contained")}
              onMouseLeave={() => setCostVariant("outlined")}
            >
              Update costs
            </Button>
          </Grid>

          <Grid item>
            <Button
              onClick={() => {
                setOpenFine(true);
              }}
              onMouseEnter={() => setFineVariant("contained")}
              onMouseLeave={() => setFineVariant("outlined")}
            >
              Update Fine
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* =========================================|| COSTS ||========================================= */}
      <Dialog open={false}>
        <DialogTitle>
          <Typography variant="h3" color="primary.main" fontWeight={500}>
            Costs
          </Typography>
        </DialogTitle>
        <form
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   if (
          //     tsbc !== undefined &&
          //     tsac !== undefined &&
          //     tsmc !== undefined &&
          //     trev !== undefined &&
          //     tcbc !== undefined &&
          //     tcac !== undefined &&
          //     tcmc !== undefined
          //   ) {
          //     setOpenCosts(false);
          //     setLoading(true);
          //     Axios.post(`http://${ip}:6969/Costs`, {
          //       sbc: tsbc,
          //       sac: tsac,
          //       smc: tsmc,
          //       reval: trev,
          //       cbc: tcbc,
          //       cac: tcac,
          //       cmc: tcmc,
          //     }).then((resp) => {
          //       console.log(resp, tsbc, tsac, tsmc, trev, tcbc, tcac, tcmc);
          //       if (resp.data.done) {
          //         setSupBase(tsbc);
          //         setSupAdd(tsac);
          //         setSupMax(tsmc);
          //         setReval(trev);
          //         setCbtBase(tcbc);
          //         setCbtAdd(tsac);
          //         setCbtMax(tcmc);
          //         setLoading(false);
          //         setDone(true);
          //       } else {
          //         setLoading(false);
          //         setErrorAlert(true);
          //       }
          //     });
          //   } else {
          //     setFillAlert(true);
          //   }
          // }}
        >
          <DialogContent>
            <DialogContentText>
              <Typography variant="h5" mb={2}>
                Supplementary
              </Typography>
              <Grid container textAlign={"center"} spacing={2} mb={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Base Cost"
                    defaultValue={supBase}
                    onChange={(e) => {
                      tsbc = parseInt(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Additional Cost"
                    defaultValue={supAdd}
                    onChange={(e) => {
                      tsac = parseInt(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Cost"
                    defaultValue={supMax}
                    onChange={(e) => {
                      tsmc = parseInt(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
              <br />
              <Divider />
              <br />

              <Typography variant="h5" mb={2}>
                Re-Evaluation
              </Typography>
              <Grid container alignContent={"space-around"} spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Cost"
                    defaultValue={reval}
                    onChange={(e) => {
                      trev = parseInt(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>

              <br />
              <Divider />
              <br />

              <Typography variant="h5" mb={2}>
                CBT
              </Typography>
              <Grid container textAlign={"center"} spacing={2} mb={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Base Cost"
                    defaultValue={cbtBase}
                    onChange={(e) => {
                      tcbc = parseInt(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Additional Cost"
                    defaultValue={cbtAdd}
                    onChange={(e) => {
                      tcac = parseInt(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Cost"
                    defaultValue={cbtMax}
                    onChange={(e) => {
                      tcmc = parseInt(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button color="error" onClick={handleClose}>
              cancel
            </Button>
            <Button type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* =========================================||  FINE  ||========================================= */}
      <Dialog
        sx={{ backdropFilter: "blur(1px)" }}
        open={openFine}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h3" color="primary.main" fontWeight={500}>
            Fine
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h5" mb={2}>
              Supplementary
            </Typography>
            <Grid
              container
              textAlign={"center"}
              alignItems={"center"}
              spacing={2}
              mb={2}
            >
              <Grid item xs={12} textAlign={"justify"}>
                <Typography
                  variant="subtitle1"
                  color={"error"}
                  fontWeight={500}
                  mb={2}
                >
                  Enter the date from when the particular fine is applicable.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Fine 1"
                  defaultValue={fine_1}
                  onChange={(e) => {
                    tf1 = parseInt(e.target.value);
                  }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <MobileDatePicker
                      slotProps={{
                        textField: {
                          helperText: "DD/MM/YYYY",
                        },
                      }}
                      defaultValue={fine_1Dt}
                      format="DD/MM/YYYY"
                      label="From"
                    //   onChange={(newValue) => {
                    //     tf1dt = `${newValue.$d}`;
                    //   }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Fine 2"
                  defaultValue={fine_2}
                  onChange={(e) => {
                    tf2 = parseInt(e.target.value);
                  }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <MobileDatePicker
                      slotProps={{
                        textField: {
                          helperText: "DD/MM/YYYY",
                        },
                      }}
                      defaultValue={fine_2Dt}
                      format="DD/MM/YYYY"
                      label="From"
                    //   onChange={(newValue) => {
                    //     tf2dt = `${newValue.$d}`;
                    //   }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Fine 3"
                  defaultValue={fine_3}
                  onChange={(e) => {
                    tf3 = parseInt(e.target.value);
                  }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <MobileDatePicker
                      slotProps={{
                        textField: {
                          helperText: "DD/MM/YYYY",
                        },
                      }}
                      defaultValue={fine_3Dt}
                      format="DD/MM/YYYY"
                      label="From"
                    //   onChange={(newValue) => {
                    //     tf3dt = `${newValue.$d}`;
                    //   }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              setOpenFine(false);
            }}
          >
            CANCEL
          </Button>
          <Button
            // onClick={() => {
            //   setOpenFine(false);
            //   setLoading(true);
            //   Axios.post(`http://${ip}:6969/Fines`, {
            //     fine_1: tf1,
            //     fine_2: tf2,
            //     fine_3: tf3,
            //     nofinedt: tnofine,
            //     fine_1Dt: tf1dt,
            //     fine_2Dt: tf2dt,
            //     fine_3Dt: tf3dt,
            //   }).then((resp) => {
            //     if (resp.data.done) {
            //       setLoading(false);
            //       setFineDone(true);
            //     }
            //   });
            // }}
          >
            save
          </Button>
        </DialogActions>
      </Dialog>

      {/* =========================================||  ALERTS  ||========================================= */}
      <>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2500}
          open={done}
          onClose={() => {
            setDone(false);
          }}
        >
          <Alert
            severity="success"
            variant="standard"
            onClose={() => {
              setDone(false);
            }}
          >
            Updated Costs
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2500}
          open={errorAlert}
          onClose={() => {
            setErrorAlert(false);
          }}
        >
          <Alert
            severity="error"
            variant="standard"
            onClose={() => {
              setErrorAlert(false);
            }}
          >
            There was a problem while uploading
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2500}
          open={fillAlert}
          onClose={() => {
            setFillAlert(false);
          }}
        >
          <Alert
            severity="warning"
            variant="standard"
            onClose={() => {
              setFillAlert(false);
            }}
          >
            Enter proper values
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2500}
          open={fineDone}
          onClose={() => {
            setFineDone(false);
          }}
        >
          <Alert
            severity="success"
            variant="standard"
            onClose={() => {
              setFineDone(false);
            }}
          >
            Fines updated
          </Alert>
        </Snackbar>
      </>

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
            Manage Costs
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText textAlign="justify" fontWeight={500}>
            <h2 className="help">
              <>Overview</>
            </h2>
            <p>
              View/change costs and fines for different exams.
              <Typography color="error" variant="h5" fontWeight={500} mt={1}>
                Fine is applicable ony to <code>Supplementary</code> exam.
              </Typography>
            </p>
            <Divider />
            <br />
            <h2 className="help">
              <>Parameters</>
            </h2>
            <p>
              <span className="helpHead">Base Cost</span> - Initial cost for the
              particular exam (Applicable for one subject only)
            </p>
            <p>
              <span className="helpHead">Additional Cost</span> - Extra cost
              added to{" "}
              <code>
                <>Base Cost</>
              </code>{" "}
              for ever additional subject until the total is 3
            </p>
            <p>
              <span className="helpHead">Max Cost</span> - Maximum cost for the
              student (SAME FOR 4/5 SUBJECTS)
            </p>
            <p>
              <span className="helpHead">Fine</span> - Fine amount applied to
              the total
            </p>
            <p>
              <span className="helpHead">Fine Date</span> - The date when the
              file is applicable
            </p>
            <Divider />
            <br />
            <h2 className="help">
              <>Procedure</>
            </h2>
            <p>
              You can view the costs for all three exams from the table. If you
              ever want to change the costs/fine amounts, select{" "}
              <code>Update Costs</code>/<code>Update Fine</code> respectively.
              Then, fill the fields with the right value and click save to save
              the costs/fines.
              <Typography variant="h5" color="error.main" fontWeight={500}>
                Remember, the fine date MUST be the date from when the fine is
                applicable.
              </Typography>
            </p>
            <Divider />
            <br />
            <h2 className="help">
              <>Exceptions</>
            </h2>
            <p>
              If the fine date is not properly set, grand total for the exam
              will be wrongly calculated.
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

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default Costs;
