import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import HelpIcon from "@mui/icons-material/Help";
import { useEffect, useState } from "react";
import Axios from "axios";
import { formatCost } from "../../misc/CostFormater";
import Title from "../../components/Title";
import { IconButton } from "@mui/material";

export function Costs() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [suppleBaseCost, setSuppleBaseCost] = useState(0);
  const [suppleAddCost, setSuppleAddCost] = useState(0);
  const [suppleMaxCost, setSuppleMaxCost] = useState(0);
  const [revalCost, setRevalCost] = useState(0);
  const [writtenBaseCost, setWrittenBaseCost] = useState(0);
  const [writtenAddCost, setWrittenAddCost] = useState(0);
  const [writtenMaxCost, setWrittenMaxCost] = useState(0);

  useEffect(() => {
    Axios.get(`api/cost/costs?module=cbt`).then((res) => {
      setWrittenBaseCost(res.data["cbc"]);
      setWrittenAddCost(res.data["cac"]);
      setWrittenMaxCost(res.data["cfc"]);
    });
    Axios.get(`api/cost/costs?module=reval`).then((res) => {
      setRevalCost(res.data["rev"]);
    });
    Axios.get(`api/cost/costs?module=supple`).then((res) => {
      setSuppleBaseCost(res.data.costs["sbc"]);
      setSuppleAddCost(res.data.costs["sac"]);
      setSuppleMaxCost(res.data.costs["sfc"]);
    });
  });

  const initialRows: GridRowsProp = [
    {
      id: "Supplementary",
      baseCost: formatCost(suppleBaseCost),
      additionalCost: formatCost(suppleAddCost),
      maxCost: formatCost(suppleMaxCost),
    },
    {
      id: "Revaluation",
      baseCost: formatCost(revalCost),
      additionalCost: "NA",
      maxCost: "NA",
    },
    {
      id: "Written Test",
      baseCost: formatCost(writtenBaseCost),
      additionalCost: formatCost(writtenAddCost),
      maxCost: formatCost(writtenMaxCost),
    },
  ];

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    console.log(id);
    console.log(rowModesModel[id]);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const initialColumns: GridColDef[] = [
    { field: "id", headerName: "Exam", width: 200, editable: true },
    {
      field: "baseCost",
      headerName: "Base Cost",
      type: "number",
      width: 200,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "additionalCost",
      headerName: "Additional Cost",
      type: "number",
      width: 200,
      align: "center",
      headerAlign: "center",
      editable: true,
      renderCell: ({ value }) => value,
    },
    {
      field: "maxCost",
      headerName: "Max Cost",
      headerAlign: "center",
      width: 200,
      editable: true,
      align: "center",
      type: "number",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const [rows, setRows] = useState(initialRows);

  return (
    <>
      <div className="flex justify-center">
        <Title />
        <IconButton>
          <HelpIcon color="primary" />
        </IconButton>
      </div>
      <Box
        sx={{
          background: "white",
          width: "max-Content",
          margin: "auto",
        }}
      >
        <DataGrid
          rows={rows}
          columns={initialColumns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          hideFooterSelectedRowCount
          hideFooterPagination
        />
      </Box>
    </>
  );
}

export function Fines() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [fine1, setFine1] = useState(0);
  const [fine2, setFine2] = useState(0);
  const [fine3, setFine3] = useState(0);
  const d1 = new Date("2024-03-14");
  const d2 = new Date("2024-03-20");
  const d3 = new Date("2024-03-25");

  useEffect(() => {
    Axios.get(`api/cost/costs?module=supple`).then((res) => {
      setFine1(res.data.fines["A"]);
      setFine2(res.data.fines["B"]);
      setFine3(res.data.fines["C"]);
    });
  }, []);

  const initialRows: GridRowsProp = [
    {
      id: "Supplemenatary Exam",
      fine1: fine1,
      date1: d1,
      fine2: fine2,
      date2: d2,
      fine3: fine3,
      date3: d3,
    },
  ];

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

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

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const initialColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Exam Name",
      width: 190,
      editable: true,
    },
    {
      field: "fine1",
      headerName: "Fine 1",
      width: 100,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date1",
      type: "date",
      headerName: "Date",
      width: 140,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fine2",
      headerName: "Fine 2",
      width: 100,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date2",
      type: "date",
      headerName: "Date",
      width: 140,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fine3",
      headerName: "Fine 3",
      width: 100,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date3",
      type: "date",
      headerName: "Date",
      width: 150,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 80,
      cellClassName: "actions",
      headerAlign: "center",
      align: "center",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const [rows, setRows] = useState(initialRows);

  return (
    <>
      <div className="flex justify-center mt-6">
        <Title />
        <IconButton>
          <HelpIcon color="primary" />
        </IconButton>
      </div>
      <Box
        sx={{
          background: "white",
          width: "max-Content",
          margin: "auto",
        }}
      >
        <DataGrid
          rows={rows}
          columns={initialColumns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          hideFooterSelectedRowCount
          hideFooterPagination
        />
      </Box>
    </>
  );
}

export default function ManageCosts() {
  return (
    <>
      <Costs />
      <Fines />
    </>
  );
}
