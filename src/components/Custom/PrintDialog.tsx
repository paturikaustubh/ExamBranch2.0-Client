import { Edit, PrintOutlined } from "@mui/icons-material";
import {
  DialogTitle,
  Typography,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { CustDialog } from "./CustDialog";
import Axios from "axios";
import { ExamSearchResponseProps } from "../../Types/responseTypes";

export function PrintDialog({
  rollNo,
  setStudentCopyGenerated,
  selectedSubjects,
  printTable,
}: {
  rollNo: string;
  setStudentCopyGenerated: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSubjects: ExamSearchResponseProps;
  printTable: boolean;
}) {
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  return (
    <div className="flex ml-auto gap-2 items-center border-none no-print">
      <Tooltip
        title={printTable && "To edit values, delete records from print table."}
      >
        <button
          className="blue-button-outline flex items-center gap-2"
          onClick={() => setStudentCopyGenerated(false)}
          disabled={printTable}
        >
          <Edit fontSize="small" />
          Edit Values
        </button>
      </Tooltip>
      <button
        className="blue-button-filled flex items-center gap-2"
        onClick={() => setOpenPrintDialog(true)}
      >
        <PrintOutlined fontSize="small" /> Print
      </button>
      <CustDialog open={openPrintDialog} className="no-print">
        <DialogTitle>
          <div className="flex gap-4 items-end">
            <Typography variant="h4">Print for </Typography>
            <Typography
              variant="h3"
              color="info.main"
              component="span"
              fontWeight={600}
            >
              {rollNo}
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText fontWeight={500} component={"div"}>
            <Typography color={"error"} variant="h6" textAlign={"left"}>
              Ensure the print options satisfy the following conditions:
            </Typography>
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: "2.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
                marginBlock: "1.5rem",
              }}
            >
              <li>
                Only one page is available during print. If you find two or more
                pages, reduce the scale of the content.
              </li>
              <li>
                Only one page is available during print. If you find two or more
                pages, reduce the scale of the content.
              </li>
              <li>
                The <code>Margin</code> value is set to <code>None</code>.
              </li>
              <li>Re-scale the content to fit in entire page.</li>
              <li>
                <code>Print headers and footers</code> are un-checked/disabled.
              </li>
              <li>
                <code>Print backgrounds/background graphics</code> are
                checked/enabled.
              </li>
            </ul>

            <Typography color="primary.main">
              All the above options can be found under{" "}
              <code>Additional settings/More settings</code> section.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="red-button-sm"
            onClick={() => setOpenPrintDialog(false)}
          >
            Cancel
          </button>
          <button
            className="blue-button-sm"
            onClick={async () => {
              setOpenPrintDialog(false);
              window.print();
              const { data } = await Axios.post(
                `http://localhost:6969/api/reval/print/${rollNo}`,
                {
                  selectedSubjects: selectedSubjects,
                  username: localStorage.getItem("username"),
                }
              );

              // if(data.done){
              //   set
              // }
            }}
          >
            Print
          </button>
        </DialogActions>
      </CustDialog>
    </div>
  );
}
