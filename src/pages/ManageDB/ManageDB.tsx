import {
  MenuItem,
  ListSubheader,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuList,
} from "@mui/material";
import { CustTextField } from "../../components/Custom/CustTextField";
import Title from "../../components/Title";
import { ReactNode, useContext, useState } from "react";
import { Add, DeleteOutline, Edit, SearchOutlined } from "@mui/icons-material";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import { CustDataGrid } from "../../components/Custom/CustDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import {
  AvailableDbTables,
  ManageDBResponseArr,
  ManageDBResponseProps,
} from "../../Types/responseTypes";
import { CustDialog } from "../../components/Custom/CustDialog";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function ManageDB() {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  // ANCHOR STATES && VARS  ||========================================================================
  const [table, setTable] = useState<AvailableDbTables>("studentinfo");
  const [rollNo, setRollNo] = useState("");
  const [responseData, setResponseData] = useState<ManageDBResponseArr>([]);

  const datagridCols: GridColDef[] = [
    { field: "id", headerName: "S No.", minWidth: 80 },
    {
      field: "subCode",
      headerName: "Subject Code",
      flex: 1,
      minWidth: 170,
      renderCell: ({ row, value }) => (
        <ManageRowDetails
          row={row}
          title={value}
          type="update"
          table={table}
          responseData={responseData}
          setResponseData={setResponseData}
        />
      ),
    },
    {
      field: "subName",
      headerName: "Subject Name",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "grade",
      headerName: "Grade",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "acYear",
      headerName: "AC Year",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "sem",
      headerName: "Semester",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "stat",
      headerName: "Status",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "exYear",
      headerName: "Exam Year",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "exMonth",
      headerName: "Exam Month",
      flex: 1,
      minWidth: 160,
      cellClassName: "text-right",
    },
    {
      field: "user",
      headerName: "User",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "total",
      headerName: "Amount Paid",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "regDate",
      headerName: "Registered Date",
      flex: 1,
      minWidth: 180,
      renderCell: ({ value }) => dayjs(value).format("DD MMM, YYYY"),
    },
  ];

  // ANCHOR JSX  ||========================================================================
  return (
    <>
      <Title title="Manage Database" />
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 no-print items-center">
        <CustTextField
          select
          label="Table"
          value={table}
          onChange={({ target: { value } }) => {
            setTable(value as AvailableDbTables);
            setResponseData([]);
          }}
        >
          <MenuItem value={"studentinfo"}>Student Database</MenuItem>
          <ListSubheader style={{ backgroundColor: "#d4d4d4" }}>
            Paid Entries
          </ListSubheader>
          <MenuItem value={"paidsupply"}>Paid Supplementary</MenuItem>
          <MenuItem value={"paidreevaluation"}>Paid Revaluation</MenuItem>
          <MenuItem value={"paidcbt"}>Paid WrittenTest</MenuItem>
          <ListSubheader style={{ backgroundColor: "#d4d4d4" }}>
            Print Entries
          </ListSubheader>
          <MenuItem value={"printsupply"}>Print Supplementary</MenuItem>
          <MenuItem value={"printreval"}>Print Revaluation</MenuItem>
          <MenuItem value={"printcbt"}>Print Written Test</MenuItem>
        </CustTextField>

        {/* ANCHOR FORM ||======================================================================== */}
        <form
          className="row-start-2 grid sm:grid-cols-3 grid-cols-1 items-center gap-x-4 gap-y-2 sm:col-span-3 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            loading?.showLoading(true);
            Axios.get(
              `api/manage/database/search?rollNo=${rollNo}&tableName=${table}`
            )
              .then(
                ({
                  data: { stdData },
                }: {
                  data: { stdData: ManageDBResponseArr };
                }) => {
                  console.log(stdData);
                  if (stdData.length === 0) {
                    alert?.showAlert("No data found", "warning");
                  } else
                    setResponseData(
                      stdData.map((element, indx) => ({
                        ...element,
                        id: indx + 1,
                      }))
                    );
                }
              )
              .catch(() =>
                alert?.showAlert("Couldn't connect to the server", "error")
              )
              .finally(() => loading?.showLoading(false));
          }}
        >
          <CustTextField
            label="Roll Number"
            className="col-span-1"
            inputProps={{ maxLength: 10 }}
            value={rollNo}
            onChange={({ target: { value } }) => {
              setRollNo(value.toUpperCase());
              setResponseData([]);
            }}
            autoFocus
          />
          <button
            className="blue-button-filled flex items-center gap-2 sm:ml-0 ml-auto"
            disabled={rollNo.length < 10}
          >
            <SearchOutlined fontSize="small" />
            Search
          </button>
        </form>
      </div>

      {/* ANCHOR DATAGRID ||======================================================================== */}
      {responseData.length > 0 && (
        <div className={`bg-white p-4 rounded-sm mt-8 h-fit`}>
          <div className="flex mb-4 items-center justify-between text-6xl font-semibold text-blue-500">
            <span className="">{rollNo}</span>
            {table === "studentinfo" && (
              <span>
                <span className="text-red-500">
                  {responseData.filter(({ grade }) => grade === "F").length}
                </span>

                <span className="text-4xl font-normal">
                  /{responseData.length}
                </span>
              </span>
            )}
          </div>
          <CustDataGrid
            columns={datagridCols}
            rows={responseData}
            disableRowSelectionOnClick
            checkboxSelection
            columnVisibilityModel={{
              grade: table === "studentinfo",
              exYear: table === "studentinfo",
              exMonth: table === "studentinfo",
              user: table !== "studentinfo",
              total: table !== "studentinfo",
              regDate: table !== "studentinfo",
              stat: table === "paidreevaluation",
              branch: table === "paidcbt",
            }}
            slots={{
              toolbar: () => (
                <div className="flex items-center gap-2 justify-end py-4 pr-4">
                  <ManageRowDetails
                    title={
                      <>
                        <Add fontSize="small" />
                        Add New Record
                      </>
                    }
                    type="new"
                    table={table}
                    rollNo={rollNo}
                    responseData={responseData}
                    setResponseData={setResponseData}
                  />
                </div>
              ),
            }}
            initialState={{ pagination: { paginationModel: { pageSize: 50 } } }}
            getRowClassName={({ row }) => {
              if (row?.grade == "F") return "datagrid-row-red";
              return "";
            }}
          />
        </div>
      )}
    </>
  );
}

// ANCHOR MANAGE ROW DETAILS  ||========================================================================
function ManageRowDetails({
  title,
  row,
  type,
  table,
  rollNo,
  responseData,
  setResponseData,
}: {
  title: ReactNode;
  type: "new" | "update";
  table: AvailableDbTables;
  row?: ManageDBResponseProps;
  rollNo?: string;
  responseData: ManageDBResponseArr;
  setResponseData: React.Dispatch<React.SetStateAction<ManageDBResponseArr>>;
}) {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);
  const [openRowDetailsDialog, setOpenRowDetailsDialog] = useState(false);
  const [newRowDetails, setNewRowDetails] = useState<ManageDBResponseProps>({
    ...row,
    grade: row?.grade ?? "O",
    acYear: row?.acYear ?? 1,
    sem: row?.sem ?? 1,
  } as ManageDBResponseProps);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >();
  const openMenu = Boolean(anchorEl);

  return (
    <>
      <button
        className={`flex items-center gap-2 ${
          type === "new" ? "blue-button-outline" : "text-blue-500"
        }`}
        onClick={({ currentTarget }) => {
          type === "update"
            ? setAnchorEl(currentTarget)
            : setOpenRowDetailsDialog(true);
        }}
      >
        {title}
      </button>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
      >
        <MenuList
          sx={{ outline: 0, display: "flex", flexDirection: "column", gap: 1 }}
          disablePadding
        >
          <button
            className="flex items-center gap-4 hover:bg-neutral-200 w-full h-full p-3"
            onClick={() => setOpenRowDetailsDialog(true)}
          >
            <Edit fontSize="small" /> Edit Details
          </button>
          <button className="flex items-center gap-4 hover:bg-neutral-200 w-full h-full p-3">
            <DeleteOutline fontSize="small" /> Delete Record
          </button>
        </MenuList>
      </Menu>

      <CustDialog
        open={openRowDetailsDialog}
        onClose={() => setOpenRowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle component={"div"}>
          <span className="text-3xl font-semibold text-blue-500">
            {type === "new"
              ? `Add new record for ${rollNo}`
              : `${newRowDetails?.subCode}-${newRowDetails?.subName}`}
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-6">
            <CustTextField
              label="Subject Code"
              value={newRowDetails?.subCode}
              onChange={({ target: { value } }) => {
                setNewRowDetails({
                  ...newRowDetails,
                  subCode: value.toUpperCase(),
                });
              }}
              onBlur={({ target: { value } }) => {
                if (
                  responseData.filter(({ subCode }) => subCode === value)
                    .length > 0
                ) {
                  setAlreadyExists(true);
                  alert?.showAlert("Subject code already exists", "warning");
                } else setAlreadyExists(false);
              }}
            />
            <CustTextField
              label="Subject Name"
              value={newRowDetails?.subName}
              onChange={({ target: { value } }) => {
                setNewRowDetails({
                  ...newRowDetails,
                  subName: value.toUpperCase(),
                });
              }}
            />
            {table === "studentinfo" ? (
              <CustTextField
                label="Grade"
                value={newRowDetails?.grade}
                onChange={({ target: { value } }) => {
                  setNewRowDetails({
                    ...newRowDetails,
                    grade: value as grades,
                  });
                }}
                select
              >
                <MenuItem value="O">O</MenuItem>
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="F">F</MenuItem>
              </CustTextField>
            ) : table === "paidreevaluation" ? (
              <CustTextField
                label="Status"
                value={newRowDetails?.stat !== "R" ? "S" : "R"}
                onChange={({ target: { value } }) =>
                  setNewRowDetails({
                    ...newRowDetails,
                    stat: value as "R" | "S",
                  })
                }
                select
              >
                <MenuItem value="R">Regular</MenuItem>
                <MenuItem value="S">Supplementary</MenuItem>
              </CustTextField>
            ) : null}
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 mt-6 items-center gap-6">
            {table === "studentinfo" && (
              <>
                <CustTextField
                  label="Exam Year"
                  type="number"
                  value={newRowDetails?.exYear}
                  InputProps={{
                    inputProps: { max: dayjs().year() },
                  }}
                  onChange={({ target: { value } }) => {
                    setNewRowDetails({
                      ...newRowDetails,
                      exYear: parseInt(value) > 0 ? parseInt(value) : 0,
                    });
                  }}
                />
                <CustTextField
                  label="Exam Month"
                  type="number"
                  value={newRowDetails?.exMonth}
                  InputProps={{
                    inputProps: { min: 1, max: 12 },
                  }}
                  onChange={({ target: { value } }) => {
                    setNewRowDetails({
                      ...newRowDetails,
                      exMonth: parseInt(value) > 0 ? parseInt(value) : 0,
                    });
                  }}
                />
              </>
            )}
            <CustTextField
              label="Academic Year"
              value={newRowDetails?.acYear}
              onChange={({ target: { value } }) => {
                setNewRowDetails({
                  ...newRowDetails,
                  acYear: parseInt(value) as 1 | 2 | 3 | 4,
                });
              }}
              select
            >
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
            </CustTextField>
            <CustTextField
              label="Semester"
              value={newRowDetails?.sem}
              onChange={({ target: { value } }) => {
                setNewRowDetails({
                  ...newRowDetails,
                  sem: parseInt(value) as 1 | 2,
                });
              }}
              select
            >
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </CustTextField>
            {table !== "studentinfo" && (
              <>
                <CustTextField
                  label="User"
                  value={newRowDetails?.user}
                  onChange={({ target: { value } }) =>
                    setNewRowDetails({ ...newRowDetails, user: value })
                  }
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Registered Date"
                    value={dayjs(newRowDetails?.regDate)}
                    onChange={(value) =>
                      setNewRowDetails({
                        ...newRowDetails,
                        regDate: dayjs(value),
                      })
                    }
                  />
                </LocalizationProvider>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="red-button"
            onClick={() => setOpenRowDetailsDialog(false)}
          >
            Cancel
          </button>
          <button
            className="blue-button"
            onClick={() => {
              loading?.showLoading(true);
              setResponseData((prevVals) => {
                const indx = prevVals.findIndex(
                  ({ subCode }) => subCode === row?.subCode
                );
                if (indx > -1) {
                  return [
                    ...prevVals.slice(0, indx),
                    newRowDetails,
                    ...prevVals.slice(indx + 1),
                  ];
                }

                return [
                  ...prevVals,
                  { ...newRowDetails, id: prevVals.length + 1 },
                ];
              });
              setOpenRowDetailsDialog(false);
              loading?.showLoading(false);
            }}
            disabled={
              !newRowDetails.subCode ||
              !newRowDetails.subName ||
              !newRowDetails.exYear ||
              !newRowDetails.exMonth ||
              alreadyExists
            }
          >
            Save
          </button>
        </DialogActions>
      </CustDialog>
    </>
  );
}
