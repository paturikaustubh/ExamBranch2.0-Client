import {
  ClickAwayListener,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popover,
} from "@mui/material";
import { CustTextField } from "../../components/Custom/CustTextField";
import { useRef, useState } from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  DeleteForeverOutlined,
} from "@mui/icons-material";
import { CustDialog } from "../../components/Custom/CustDialog";
import Axios from "axios";
import dayjs from "dayjs";

export default function Download() {
  // ANCHOR STATES && VARS  ||========================================================================
  const [exam, setExam] = useState<"supple" | "reval" | "cbt">("supple");
  const [acYear, setAcYear] = useState("0");
  const [sem, setSem] = useState("0");
  const buttonPopoverRef = useRef<HTMLButtonElement>(null);
  const [openDonloadOpts, setOpenDonloadOpts] = useState(false);
  const [examType, setExamType] = useState<"paid" | "print" | "report">("paid");

  const examTypeNames = {
    paid: "Registered",
    print: "Uregistered",
    report: "Report",
  };
  const examNames = {
    supple: "Supplementary",
    reval: "Revaluation",
    cbt: "Written Test",
  };

  // ANCHOR FUNCTIONS  ||========================================================================
  const handleDownOptsClose = () => {
    setOpenDonloadOpts(false);
  };

  return (
    <>
      <div className="flex no-print">
        <span className="page-title">Download</span>
      </div>

      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-6 no-print">
        <CustTextField
          select
          label="Exam"
          value={exam}
          onChange={({ target: { value } }) =>
            setExam(value as "supple" | "reval" | "cbt")
          }
        >
          <MenuItem value="supple">Supplementary</MenuItem>
          <MenuItem value="reval">Revaluation</MenuItem>
          <MenuItem value="cbt">Written Test</MenuItem>
        </CustTextField>

        <div className="flex w-full col-span-2 row-start-2 gap-4">
          <CustTextField
            select
            label="Academic Year"
            value={acYear}
            onChange={({ target: { value } }) => setAcYear(value)}
          >
            <MenuItem value="0">All</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
          </CustTextField>
          <CustTextField
            select
            label="Semester"
            value={sem}
            onChange={({ target: { value } }) => setSem(value)}
          >
            <MenuItem value="0">Both</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
          </CustTextField>
        </div>

        <div className="row-start-3">
          <div className="flex items-center divide-x divide-blue-600">
            <button
              className="blue-button-filled"
              style={{ borderRadius: "6px 0px 0px 6px" }}
              ref={buttonPopoverRef}
              onClick={async () => {
                Axios.get(
                  `api/download/table?tableName=${
                    examType + exam
                  }&acYear=${acYear}&sem=${sem}`,
                  { responseType: "blob" }
                ).then(({ data, headers }) => {
                  console.log(headers);
                  const url = window.URL.createObjectURL(new Blob([data]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute(
                    "download",
                    `${examTypeNames[examType]}_${
                      examNames[exam]
                    }_${dayjs().format("DD-MMM-YY_hh-mm_A")}.xlsx`
                  );
                  document.body.appendChild(link);
                  link.click();
                });
              }}
            >
              {examTypeNames[examType]}
            </button>
            <button
              className="blue-button-filled"
              style={{ borderRadius: "0px 6px 6px 0px" }}
              onClick={() => setOpenDonloadOpts(true)}
            >
              {!openDonloadOpts ? (
                <ArrowDropDown fontSize="small" />
              ) : (
                <ArrowDropUp fontSize="small" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Popover open={openDonloadOpts} anchorEl={buttonPopoverRef.current}>
        <Grow in={openDonloadOpts} style={{ transformOrigin: "left center" }}>
          <Paper>
            <ClickAwayListener onClickAway={handleDownOptsClose}>
              <MenuList autoFocusItem>
                <MenuItem
                  value={"paid"}
                  onClick={() => {
                    setExamType("paid");
                    handleDownOptsClose();
                  }}
                >
                  Registered
                </MenuItem>
                <MenuItem
                  value={"print"}
                  onClick={() => {
                    setExamType("print");
                    handleDownOptsClose();
                  }}
                >
                  Unregistered
                </MenuItem>
                <MenuItem
                  value={"report"}
                  onClick={() => {
                    setExamType("report");
                    handleDownOptsClose();
                  }}
                >
                  Report
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      </Popover>
      <Truncate />
    </>
  );
}

function Truncate() {
  const [openDialog, setOpenDialog] = useState(false);
  const [exam, setExam] = useState("supple");
  const [acYear, setAcYear] = useState("0");
  const [sem, setSem] = useState("0");

  return (
    <>
      <button
        className="red-button-filled fixed bottom-4 right-4 flex items-center gap-2"
        onClick={() => setOpenDialog(true)}
      >
        <DeleteForeverOutlined />
        Truncate
      </button>

      <CustDialog open={openDialog} maxWidth="lg" fullWidth>
        <DialogTitle component={"div"}>
          <span className="lg:text-5xl md:text-4xl text-3xl text-red-600 font-bold">
            Truncate
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="flex gap-2 items-center justify-between mt-4">
            <CustTextField
              select
              label="Exam"
              value={exam}
              onChange={({ target: { value } }) => setExam(value)}
            >
              <MenuItem value="supple">Supplementary</MenuItem>
              <MenuItem value="reval">Revaluation</MenuItem>
              <MenuItem value="cbt">Written Test</MenuItem>
            </CustTextField>
            <CustTextField
              select
              label="Academic Year"
              value={acYear}
              onChange={({ target: { value } }) => setAcYear(value)}
            >
              <MenuItem value="0">All</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
            </CustTextField>
            <CustTextField
              select
              label="Semester"
              value={sem}
              onChange={({ target: { value } }) => setSem(value)}
            >
              <MenuItem value="0">Both</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </CustTextField>
          </div>
        </DialogContent>
        <DialogActions>
          <button className="red-button" onClick={() => setOpenDialog(false)}>
            Cancel
          </button>
          <button className="blue-button">Truncate</button>
        </DialogActions>
      </CustDialog>
    </>
  );
}
