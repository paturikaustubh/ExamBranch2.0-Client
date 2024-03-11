import {
  MenuItem,
  ListSubheader,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CustTextField } from "../../components/Custom/CustTextField";
import Title from "../../components/Title";
import { useContext, useState } from "react";
import {
  Add,
  Cancel,
  Delete,
  Edit,
  Save,
  SearchOutlined,
} from "@mui/icons-material";
import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { LoadingContext } from "../../components/Context/Loading";
import { CustDataGrid } from "../../components/Custom/CustDataGrid";
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
  AvailableDbTables,
  ManageDBResponseArr,
  ManageDBResponseProps,
} from "../../Types/responseTypes";
import { CustDialog } from "../../components/Custom/CustDialog";
import dayjs from "dayjs";
import { formatCost } from "../../misc/CostFormater";

export default function ManageDB() {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  // ANCHOR STATES && VARS  ||========================================================================
  const [table, setTable] = useState<AvailableDbTables>("studentInfo");
  const [rollNo, setRollNo] = useState("");
  const [responseData, setResponseData] = useState<ManageDBResponseArr>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const datagridCols: GridColDef[] = [
    { field: "id", headerName: "S No.", minWidth: 80, editable: false },
    {
      field: "subCode",
      headerName: "Subject Code",
      flex: 1,
      minWidth: 170,
      editable: true,
    },
    {
      field: "subName",
      headerName: "Subject Name",
      flex: 1,
      minWidth: 170,
      editable: true,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 1,
      minWidth: 130,
      editable: true,
    },
    {
      field: "grade",
      headerName: "Grade",
      flex: 1,
      minWidth: 120,
      editable: true,
    },
    {
      field: "acYear",
      headerName: "AC Year",
      flex: 1,
      minWidth: 130,
      editable: true,
      type: "number",
      renderCell: ({ value }) => value,
    },
    {
      field: "sem",
      headerName: "Semester",
      flex: 1,
      minWidth: 140,
      editable: true,
      type: "number",
      renderCell: ({ value }) => value,
    },
    {
      field: "stat",
      headerName: "Status",
      flex: 1,
      minWidth: 80,
      editable: true,
    },
    {
      field: "exYear",
      headerName: "Exam Year",
      flex: 1,
      minWidth: 150,
      editable: true,
      type: "number",
      renderCell: ({ value }) => value,
      // preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      //   const { id, value } = params.props;

      //   if (
      //     (table === "studentinfo" &&
      //       (value < dayjs().year() - 4 || value > dayjs().year())) ||
      //     (table !== "studentinfo" &&
      //       (value < dayjs().year() - 1 || value > dayjs().year()))
      //   ) {
      //     alert?.showAlert("Invalid year", "warning");
      //     setRowModesModel((prev) => {
      //       return {
      //         ...prev,
      //         [id as GridRowId]: {
      //           ...prev[id as GridRowId],
      //           isEditable: false,
      //         },
      //       };
      //     });
      //   }
      //   setRowModesModel((prev) => {
      //     return {
      //       ...prev,
      //       [id as GridRowId]: {
      //         ...prev[id as GridRowId],
      //         isEditable: true,
      //       },
      //     };
      //   });
      //   return value;
      // },
    },
    {
      field: "exMonth",
      headerName: "Exam Month",
      flex: 1,
      minWidth: 160,
      editable: true,
      type: "number",
      renderCell: ({ value }) => value,
    },
    {
      field: "user",
      headerName: "User",
      flex: 1,
      minWidth: 130,
      editable: true,
    },
    {
      field: "total",
      headerName: "Amount Paid",
      flex: 1,
      minWidth: 150,
      editable: true,
      type: "number",
      renderCell: ({ value }) => formatCost(value),
    },
    {
      field: "regDate",
      headerName: "Registered Date",
      flex: 1,
      minWidth: 180,
      renderCell: ({ value }) => dayjs(value).format("DD MMM, YYYY"),
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 130,
      cellClassName: "actions",
      renderCell: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
              key={1}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              sx={{
                color: "primary.main",
              }}
              onClick={handleCancelClick(id)}
              key={2}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            key={1}
          />,
          <DeleteConfirmDialog
            table={table}
            tablesNames={tablesNames}
            row={row}
            setResponseData={setResponseData}
            key={2}
          />,
        ];
      },
    },
  ];

  const tablesNames: Record<AvailableDbTables, string> = {
    studentInfo: "Student Database",
    printsupply: "Unregistered Supplementary",
    paidsupply: "Registered Supplementary",
    printreval: "Unregistered Revaluation",
    paidreevaluation: "Registered Revaluation",
    printcbt: "Unregistered Written Test",
    paidcbt: "Registered Written Test",
  };

  // ANCHOR EFFECTS  ||========================================================================

  // ANCHOR FUNCTIONS  ||========================================================================
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    Axios.patch(`api/manage/database/${rollNo}`, {
      details: { ...newRow, oldSubCode: oldRow.subCode },
      tableName: table,
    }).then(({ data }) => console.log(data));
    const updatedRow = { ...newRow };
    setResponseData((prevVals) => {
      return prevVals.map((row) =>
        row.id === newRow.id
          ? { ...updatedRow, oldSubCode: oldRow.subCode }
          : row
      ) as ManageDBResponseArr;
    });
    return newRow;
  };

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
          <MenuItem value={"studentInfo"}>Student Database</MenuItem>
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
            {table === "studentInfo" && (
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
              grade: table === "studentInfo",
              exYear: table === "studentInfo",
              exMonth: table === "studentInfo",
              user: table !== "studentInfo",
              total: table !== "studentInfo",
              regDate: table !== "studentInfo",
              stat: table === "paidreevaluation",
              branch: table === "paidcbt",
            }}
            // isCellEditable={(params) => {
            //   const {row} = params

            // }}
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={(ids) => setSelectedRows(ids)}
            slots={{
              toolbar: () => (
                <div className="flex items-center gap-2 justify-between p-4">
                  <div className="text-blue-500 text-4xl">
                    {tablesNames[table]}
                  </div>
                  {table === "studentInfo" && (
                    <ManageRowDetails
                      rollNo={rollNo}
                      responseData={responseData}
                      setResponseData={setResponseData}
                    />
                  )}
                </div>
              ),
            }}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newRowModesModel) =>
              setRowModesModel(newRowModesModel)
            }
            processRowUpdate={processRowUpdate}
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
  rollNo,
  responseData,
  setResponseData,
}: {
  rollNo?: string;
  responseData: ManageDBResponseArr;
  setResponseData: React.Dispatch<React.SetStateAction<ManageDBResponseArr>>;
}) {
  // STATES && VARS  ||========================================================================
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);
  const [openRowDetailsDialog, setOpenRowDetailsDialog] = useState(false);
  const [neuroDetails, setNeuroDetails] = useState<ManageDBResponseProps>({
    grade: "O",
    acYear: 1,
    sem: 1,
  } as ManageDBResponseProps);
  const [subjectAlreadyExists, setSubjectAlreadyExists] = useState(false);

  // EFFECTS  ||========================================================================

  // JSX  ||========================================================================
  return (
    <>
      <button
        className={`flex items-center gap-2 blue-button-outline`}
        onClick={() => {
          setOpenRowDetailsDialog(true);
        }}
      >
        <Add /> Add New Record
      </button>

      {/* ANCHOR ROW EDIT DIALOG ||======================================================================== */}
      <CustDialog
        open={openRowDetailsDialog}
        onClose={() => setOpenRowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle component={"div"}>
          <span className="text-3xl font-semibold text-blue-500">
            {`Add new record for ${rollNo}`}
          </span>
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loading?.showLoading(true);
            Axios.post(`api/manage/database/${rollNo}`, {
              details: neuroDetails,
              tableName: "studentinfo",
            })
              .then(({ data }) => {
                if (data.done) {
                  setResponseData((prevVals) => [
                    ...prevVals,
                    { ...neuroDetails, id: prevVals.length + 1 },
                  ]);
                  setOpenRowDetailsDialog(false);
                  alert?.showAlert("New record created", "success");
                } else alert?.showAlert(data.error.message, "warning");
              })
              .catch((e) => {
                console.log(e);
                alert?.showAlert("There was an error while saving", "error");
              })
              .finally(() => loading?.showLoading(false));
          }}
        >
          <DialogContent>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
              <CustTextField
                label="Subject Code"
                autoFocus
                value={neuroDetails.subCode ?? ""}
                onChange={({ target: { value } }) => {
                  setNeuroDetails({
                    ...neuroDetails,
                    subCode: value.toUpperCase(),
                  });
                }}
                onBlur={({ target: { value } }) => {
                  if (
                    responseData.filter(
                      ({ subCode }) =>
                        subCode.toLowerCase() === value.toLowerCase()
                    ).length > 0
                  ) {
                    setSubjectAlreadyExists(true);
                    setOpenRowDetailsDialog(true);
                    alert?.showAlert("Subject code already exists", "warning");
                  } else setSubjectAlreadyExists(false);
                }}
              />
              <CustTextField
                label="Subject Name"
                value={neuroDetails.subName ?? ""}
                onChange={({ target: { value } }) => {
                  setNeuroDetails({
                    ...neuroDetails,
                    subName: value.toUpperCase(),
                  });
                }}
              />

              <CustTextField
                label="Grade"
                value={neuroDetails?.grade}
                onChange={({ target: { value } }) => {
                  setNeuroDetails({
                    ...neuroDetails,
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
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 mt-6 items-center gap-6">
              <>
                <CustTextField
                  label="Exam Year"
                  type="number"
                  value={neuroDetails.exYear ?? ""}
                  InputProps={{
                    inputProps: {
                      min: dayjs().year() - 4,
                      max: dayjs().year(),
                    },
                  }}
                  onChange={({ target: { value } }) => {
                    setNeuroDetails({
                      ...neuroDetails,
                      exYear: parseInt(value) > 0 ? parseInt(value) : 0,
                    });
                  }}
                />
                <CustTextField
                  label="Exam Month"
                  type="number"
                  value={neuroDetails.exMonth ?? ""}
                  InputProps={{
                    inputProps: { min: 1, max: 12 },
                  }}
                  onChange={({ target: { value } }) => {
                    setNeuroDetails({
                      ...neuroDetails,
                      exMonth: parseInt(value) > 0 ? parseInt(value) : 0,
                    });
                  }}
                />
              </>

              <CustTextField
                label="Academic Year"
                value={neuroDetails?.acYear}
                onChange={({ target: { value } }) => {
                  setNeuroDetails({
                    ...neuroDetails,
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
                value={neuroDetails?.sem}
                onChange={({ target: { value } }) => {
                  setNeuroDetails({
                    ...neuroDetails,
                    sem: parseInt(value) as 1 | 2,
                  });
                }}
                select
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
              </CustTextField>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              className="red-button"
              onClick={() => setOpenRowDetailsDialog(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="blue-button"
              disabled={
                !neuroDetails.subCode ||
                !neuroDetails.subName ||
                !neuroDetails.exYear ||
                !neuroDetails.exMonth ||
                subjectAlreadyExists
              }
              type="submit"
            >
              Save
            </button>
          </DialogActions>
        </form>
      </CustDialog>

      {/* ANCHOR DELETE CONFIRM DIALOG  */}
    </>
  );
}

// ANCHOR DELTE CONFIRM DIALOG  ||========================================================================
function DeleteConfirmDialog({
  table,
  row,
  setResponseData,
  tablesNames,
}: {
  table: AvailableDbTables;
  row: ManageDBResponseProps;
  setResponseData: React.Dispatch<
    React.SetStateAction<ManageDBResponseProps[]>
  >;
  tablesNames: Record<AvailableDbTables, string>;
}) {
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);

  return (
    <>
      <GridActionsCellItem
        icon={<Delete />}
        label="Delete"
        className="textPrimary"
        onClick={() => setOpenDeleteConfirmDialog(true)}
        color="inherit"
      />
      <CustDialog
        open={openDeleteConfirmDialog}
        onClose={() => setOpenDeleteConfirmDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle component={"div"}>
          <span className="text-red-600 font-semibold text-4xl">
            Delete {row?.subCode}-{row?.subName}?
          </span>
        </DialogTitle>
        <DialogContent>
          <div>
            This will permanatly delete this subject from{" "}
            <span className="font-bold">{tablesNames[table]}</span> for{" "}
            <span className="font-bold">{row?.rollNo}</span>.
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="red-button"
            onClick={() => setOpenDeleteConfirmDialog(false)}
          >
            Cancel
          </button>
          <button
            className="blue-button"
            onClick={() => {
              loading?.showLoading(true);
              setOpenDeleteConfirmDialog(false);
              Axios.delete(
                `api/manage/database?rollNo=${row.rollNo}&subCode=${row.subCode}&tableName=${table}`
              )
                .then(() => {
                  setResponseData((prevVals) =>
                    prevVals
                      .filter(({ subCode }) => subCode !== row?.subCode)
                      .map((details, indx) => ({ ...details, id: indx + 1 }))
                  );
                  alert?.showAlert("Record deleted", "success");
                })
                .catch((e) => {
                  console.log(e);
                  alert?.showAlert(
                    "There was an error while downloading.",
                    "error"
                  );
                })
                .finally(() => loading?.showLoading(false));
            }}
          >
            Delete
          </button>
        </DialogActions>
      </CustDialog>
    </>
  );
}
