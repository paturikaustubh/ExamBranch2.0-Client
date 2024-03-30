import { MenuItem } from "@mui/material";
import Title from "../../components/Title";
import { useContext, useEffect, useRef, useState } from "react";
import { CustTextField } from "../../components/Custom/CustTextField";
import dayjs from "dayjs";
import { UploadOutlined } from "@mui/icons-material";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import * as xlsx from "xlsx";

export default function Upload() {
  const [type, setType] = useState("results");
  const [loc, setLoc] = useState("");
  const [examYear, setExamYear] = useState(dayjs().year());
  const [examMonth, setExamMonth] = useState(dayjs().month() + 1);
  const [acYear, setAcYear] = useState(0);
  const [sem, setSem] = useState(0);
  const [exam, setExam] = useState("supple");
  const alert = useContext(AlertContext);
  const folderLocationRef = useRef<HTMLInputElement>();
  const loading = useContext(LoadingContext);

  useEffect(() => {
    folderLocationRef.current?.focus();
  }, [type]);

  return (
    <>
      <Title />
      {/* Results... registered Entries... code Names... Written-Test*/}
      <div className="grid lg:grid-cols-6 md:grid-cols-2 grid-cols-2 gap-x-4 gap-y-4 no-print">
        <CustTextField
          select
          label="Type"
          value={type}
          onChange={({ target: { value } }) => {
            setType(value);
            setLoc("");
            setAcYear(0);
            setSem(0);
          }}
        >
          <MenuItem value="results">Results</MenuItem>
          <MenuItem value="registeredEntries">Registered Entries</MenuItem>
          <MenuItem value="codeNames">Code Names</MenuItem>
          <MenuItem value="cbt">Written Test</MenuItem>
        </CustTextField>
      </div>

      <div className="grid lg:grid-cols-6 md:grid-cols-2 grid-cols-2 gap-x-4 gap-y-4 no-print">

        {/* type === Results || Written-Test */}
        {(type === "results" || type === "cbt") && (
          <>
            <div className="col-span-2 row-start-2 flex gap-4">
              <CustTextField
                fullWidth
                select
                label="Year"
                value={acYear}
                onChange={({ target: { value } }) => {
                  setAcYear(parseInt(value));
                }}
              >
                <MenuItem disabled value={0}>
                  Year
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
              </CustTextField>
              <CustTextField
                fullWidth
                select
                label="Sem"
                value={sem}
                onChange={({ target: { value } }) => {
                  setSem(parseInt(value));
                }}
              >
                <MenuItem disabled value={0}>
                  Sem
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
              </CustTextField>
            </div>


            <div className="col-span-1 row-start-3 flex gap-4">
              <CustTextField
                type="number"
                label="Exam Year"
                InputProps={{
                  inputProps: { min: dayjs().year() - 1, max: dayjs().year() },
                }}
                value={examYear}
                onChange={({ target: { value } }) => {
                  setExamYear(
                    parseInt(value) > 0 ? parseInt(value) : dayjs().year() - 1
                  );
                }}
              />
            </div>
            {type === "results" && (
              <div className="col-span-1 row-start-3 flex gap-4">
                <CustTextField
                  type="number"
                  label="Exam Month"
                  InputProps={{
                    inputProps: { min: 1, max: 12 },
                  }}
                  value={examMonth}
                  onChange={({ target: { value } }) => {
                    setExamMonth(parseInt(value) > 0 ? parseInt(value) : 0);
                  }}
                />
              </div>
            )}
          </>
        )}


        {/* type === Registered Entries */}
        {type === "registeredEntries" && (
          <>
            <div className="col-span-1 row-start-2 flex gap-4">
              <CustTextField
                fullWidth
                select
                label="Exam"
                value={exam}
                onChange={({ target: { value } }) => {
                  setExam(value);
                }}
              >
                <MenuItem value={"supple"}>Supplementary</MenuItem>
                <MenuItem value={"reval"}>Revaluation</MenuItem>
                <MenuItem value={"cbt"}>Written-Test</MenuItem>
              </CustTextField>
            </div>
          </>
        )}

        {type === "codeNames" && (
          <>
            <div className="text-red-600 text-l font-bold text-2xl col-span-2 row-start-2 flex gap-4 whitespace-nowrap">
              The file name MUST be <code>code-names.csv</code>
            </div>
          </>
        )}
      </div>

      {/* Folder loaction */}
      <div className="grid pt-4 lg:grid-cols-6 md:grid-cols-2 grid-cols-2 gap-4 no-print">
        <div className="lg:col-span-2 col-span-3 lg:row-start-2 row-start-1 flex gap-4 items-center">
          <CustTextField
            fullWidth
            type="string"
            label="Folder Location"
            value={loc}
            inputRef={folderLocationRef}
            onChange={({ target: { value } }) => {
              setLoc(value);
            }}
          />
        </div>

        
        {/* button */}
        <div className="col-span-3 row-start-2 flex gap-4 items-center">
          <button
            type="submit"
            className="blue-button-filled col-span-1 h-fit flex items-center gap-2"
            disabled={
              ((type === "results" || type === "cbt") &&
                (acYear === 0 ||
                  examMonth === 0 ||
                  sem === 0 ||
                  loc.length === 0)) ||
              (type === "registeredEntries" && loc.length === 0) ||
              (type === "codeNames" && loc.length === 0)
            }
            onClick={async () => {
              if (type === "results") {
                loading?.showLoading(true, "Uploading file...");
                await Axios.post("/api/upload/results", {
                  loc: loc,
                  ext: ".xlsx",
                  acYear: acYear,
                  sem: sem,
                  exYear: examYear,
                  exMonth: examMonth,
                })
                  .then(({ data }) => {
                    console.log(data);
                    if (data.done) alert?.showAlert("Uploaded", "success");
                    else alert?.showAlert("Failed to upload", "error");
                  })
                  .catch(() =>
                    alert?.showAlert("Error while Uploading file", "error")
                  )
                  .finally(() => loading?.showLoading(false));
              } else if (type === "registeredEntries" && exam === "supple") {
                loading?.showLoading(true, "Uploading file...");
                await Axios.post("/api/upload/table/paidsupple", {
                  loc: loc,
                })
                  .then(({ data }) => {
                    if (data.done) alert?.showAlert("Uploaded", "success");
                    else alert?.showAlert("Failed to upload", "error");
                  })
                  .catch(() =>
                    alert?.showAlert("Error while Uploading file", "error")
                  )
                  .finally(() => loading?.showLoading(false));
              } else if (type === "registeredEntries" && exam === "reval") {
                loading?.showLoading(true, "Uploading file...");
                await Axios.post("/api/upload/table/paidreevaluation", {
                  loc: loc,
                })
                  .then(({ data }) => {
                    if (data.done) alert?.showAlert("Uploaded", "success");
                    else alert?.showAlert("Failed to upload", "error");
                  })
                  .catch(() =>
                    alert?.showAlert("Error while Uploading file", "error")
                  )
                  .finally(() => loading?.showLoading(false));
              } else if (type === "registeredEntries" && exam === "cbt") {
                loading?.showLoading(true, "Uploading file...");
                await Axios.post("/api/upload/table/paidcbt", {
                  loc: loc,
                })
                  .then(({ data }) => {
                    if (data.done) alert?.showAlert("Uploaded", "success");
                    else alert?.showAlert("Failed to upload", "error");
                  })
                  .catch(() =>
                    alert?.showAlert("Error while Uploading file", "error")
                  )
                  .finally(() => loading?.showLoading(false));
              } else if (type === "codeNames") {
                loading?.showLoading(true, "Uploading file...");
                await Axios.post("/api/upload/table/codenames", {
                  loc: loc,
                })
                  .then(({ data }) => {
                    if (data.done) alert?.showAlert("Uploaded", "success");
                    else alert?.showAlert("Failed to upload", "error");
                  })
                  .catch(() =>
                    alert?.showAlert("Error while Uploading file", "error")
                  )
                  .finally(() => loading?.showLoading(false));
              } else if (type === "cbt") {
                loading?.showLoading(true, "Uploading file...");
                await Axios.post("/api/upload/cbtsubjects", {
                  loc: loc,
                  ext: ".xlsx",
                  acYear: acYear,
                  sem: sem,
                  regYear: examMonth,
                })
                  .then(({ data }) => {
                    if (data.done) alert?.showAlert("Uploaded", "success");
                    else alert?.showAlert("Failed to upload", "error");
                  })
                  .catch(() =>
                    alert?.showAlert("Error while Uploading file", "error")
                  )
                  .finally(() => loading?.showLoading(false));
              }
            }}
          >
            <UploadOutlined fontSize="small" />
            Upload
          </button>

          {type !== "registeredEntries" && (
            <>
              {/* Download template button */}
              <button
                type="submit"
                className="blue-button-filled col-span-1 flex items-center gap-2"
                onClick={async () => {
                  loading?.showLoading(true, "Downloading file...");
                  let fileContent: BlobPart | null = null,
                    columnNames: string[] = [],
                    name: string | null = null;
                  if (type === "results") {
                    columnNames = [
                      "rollNo",
                      "Start entering subject codes here",
                    ];
                    fileContent = columnNames.join(",") + "\n";
                    name = "Results";
                  } else if (type === "codeNames") {
                    columnNames = ["subCode", "subName"];
                    fileContent = columnNames.join(",") + "\n";
                    name = "Code Names";
                  } else if (type === "cbt") {
                    columnNames = [
                      "subCode",
                      "subName",
                      "branch",
                      "acYear",
                      "sem",
                      "regYear",
                    ];
                    fileContent = columnNames.join(",") + "\n";
                    name = "Written Test";
                  }
                  const wb = xlsx.utils.book_new();
                  const ws = xlsx.utils.aoa_to_sheet([columnNames]); // Add your field names here
                  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
                  const excelBuffer = xlsx.write(wb, { type: "buffer", bookType: 'xlsx' });
                  const blob = new Blob([excelBuffer as BlobPart], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", `${name} Template.xlsx`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  alert?.showAlert("File downloaded successfully", "success");
                  loading?.showLoading(false);
                }}
              >
                Download Template
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
