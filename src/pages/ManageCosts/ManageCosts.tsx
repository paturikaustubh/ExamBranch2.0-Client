import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import Title from '../../components/Title';
import { formatCost } from "../../misc/CostFormater";
import { AlertContext } from '../../components/Context/AlertDetails';
import { LoadingContext } from "../../components/Context/Loading";
import { CustDataGrid } from '../../components/Custom/CustDataGrid';
import dayjs from 'dayjs';

export function Costs() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [costRows, setCostRows] = useState<GridRowsProp>([]);
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  useEffect(() => {
    Promise.all([
      Axios.get(`api/cost/costs?module=supply`),
      Axios.get(`api/cost/costs?module=revaluation`),
      Axios.get(`api/cost/costs?module=cbt`),
    ])
    .then(([suppleRes, revalRes, cbtRes]) => {
      const suppleBaseCost = suppleRes.data.costs["sbc"];
      const suppleAddCost = suppleRes.data.costs["sac"];
      const suppleMaxCost = suppleRes.data.costs["sfc"];
      const revalCost = revalRes.data["rev"];
      const writtenBaseCost = cbtRes.data["cbc"];
      const writtenAddCost = cbtRes.data["cac"];
      const writtenMaxCost = cbtRes.data["cfc"];

      const rows: GridRowsProp = [
        {
          id: "Supplementary",
          baseCost: suppleBaseCost,
          additionalCost: suppleAddCost,
          maxCost: suppleMaxCost,
        },
        {
          id: "Revaluation",
          baseCost: revalCost,
          additionalCost: 0,
          maxCost: 0
        },
        {
          id: "WrittenTest",
          baseCost: writtenBaseCost,
          additionalCost: writtenAddCost,
          maxCost: writtenMaxCost
        }
      ];
      setCostRows(rows);
    })
    .catch(error => {
      alert?.showAlert(error, "error");
    });
  }, []);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    const { id, field } = params;
  
    if (id === 'Revaluation' && (field === 'additionalCost' || field === 'maxCost')) {
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

    const editedRow = costRows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setCostRows(costRows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    if (newRow.id === 'Revaluation') {
      newRow.additionalCost = 0;
      newRow.maxCost = 0;
    }
    setCostRows(costRows.map((row) => (row.id === newRow.id ? newRow : row)));
    Axios.patch(`api/cost/costs`, {
      sbc: (newRow.id == 'Supplementary') ? newRow['baseCost'] : costRows[0]['baseCost'],
      sac: (newRow.id == 'Supplementary') ? newRow['additionalCost'] : costRows[0]['additionalCost'],
      sfc: (newRow.id == 'Supplementary') ? newRow['maxCost'] : costRows[0]['maxCost'],
      rev: (newRow.id == 'Revaluation') ? newRow['baseCost'] : costRows[1]['baseCost'],
      cbc: (newRow.id == 'WrittenTest') ? newRow['baseCost'] : costRows[2]['baseCost'],
      cac: (newRow.id == 'WrittenTest') ? newRow['additionalCost'] : costRows[2]['additionalCost'],
      cfc: (newRow.id == 'WrittenTest') ? newRow['maxCost'] : costRows[2]['maxCost']
    })
    .then(
      ({
        data: { done, error },
      }: {
        data: { done: boolean; error: string };
      }) => {
        if (done) {
          alert?.showAlert(`Succesfully updated`, "success");
        } else {
          alert?.showAlert(error,"error");
        }
      }
    )
    .catch(() =>
      alert?.showAlert("There was an error while connecting to the server.", "error")
    )
    .finally(() => loading?.showLoading(false));
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Exam', width: 200, editable: true },
    {
      field: 'baseCost',
      headerName: 'Base Cost',
      type: 'number',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      renderCell: (params) => {
        return formatCost(parseInt(params.value));
      }
    },
    {
      field: 'additionalCost',
      headerName: 'Additional Cost',
      type: 'number',
      width: 200,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      renderCell: (params) => {
        if(params.id == 'Revaluation') {
          return 'NA';
        }
        return formatCost(parseInt(params.value));
      }
    },
    {
      field: 'maxCost',
      headerName: 'Max Cost',
      headerAlign: 'center',
      width: 200,
      editable: true,
      align: 'center',
      type: 'number',
      renderCell: (params) => {
        if(params.id == 'Revaluation') {
          return 'NA';
        }
        return formatCost(parseInt(params.value));
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 200,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
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
          />
        ];
      },
    },
  ];

  return (
    <>
     <div className="mx-auto">
       <Title title="Manage Costs" />
    </div>
    <div className='w-full max-w-screen-lg mx-auto'>
      <CustDataGrid
        style={{height: "auto",
        width: "100%",
        margin: "auto"}}
        rows={costRows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        hideFooterSelectedRowCount
        hideFooterPagination
      />
    </div>
    </>
  );
}

export function Fines() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [fineRows, setFineRows] = useState<GridRowsProp>([]);
  const alert = useContext(AlertContext);
  const loading = useContext(LoadingContext);

  useEffect(() => {
    Axios.get(`api/cost/fines`)
    .then((res) => {
      const rows: GridRowsProp = [
        {
          id: '1-1',
          date0: new Date(res.data[0].no_fine),
          fine1: res.data[0].fine_1,
          date1: new Date(res.data[0].fine_1Dt),
          fine2: res.data[0].fine_2,
          date2: new Date(res.data[0].fine_2Dt),
          fine3: res.data[0].fine_3,
          date3: new Date(res.data[0].fine_3Dt)
        },
        {
          id: '1-2',
          date0: new Date(res.data[1].no_fine),
          fine1: res.data[1].fine_1,
          date1: new Date(res.data[1].fine_1Dt),
          fine2: res.data[1].fine_2,
          date2: new Date(res.data[1].fine_2Dt),
          fine3: res.data[1].fine_3,
          date3: new Date(res.data[1].fine_3Dt)
        },
        {
          id: '2-1',
          date0: new Date(res.data[2].no_fine),
          fine1: res.data[2].fine_1,
          date1: new Date(res.data[2].fine_1Dt),
          fine2: res.data[2].fine_2,
          date2: new Date(res.data[2].fine_2Dt),
          fine3: res.data[2].fine_3,
          date3: new Date(res.data[2].fine_3Dt)
        },
        {
          id: '2-2',
          date0: new Date(res.data[3].no_fine),
          fine1: res.data[3].fine_1,
          date1: new Date(res.data[3].fine_1Dt),
          fine2: res.data[3].fine_2,
          date2: new Date(res.data[3].fine_2Dt),
          fine3: res.data[3].fine_3,
          date3: new Date(res.data[3].fine_3Dt)
        },
        {
          id: '3-1',
          date0: new Date(res.data[4].no_fine),
          fine1: res.data[4].fine_1,
          date1: new Date(res.data[4].fine_1Dt),
          fine2: res.data[4].fine_2,
          date2: new Date(res.data[4].fine_2Dt),
          fine3: res.data[4].fine_3,
          date3: new Date(res.data[4].fine_3Dt)
        },
        {
          id: '3-2',
          date0: new Date(res.data[5].no_fine),
          fine1: res.data[5].fine_1,
          date1: new Date(res.data[5].fine_1Dt),
          fine2: res.data[5].fine_2,
          date2: new Date(res.data[5].fine_2Dt),
          fine3: res.data[5].fine_3,
          date3: new Date(res.data[5].fine_3Dt)
        },
        {
          id: '4-1',
          date0: new Date(res.data[6].no_fine),
          fine1: res.data[6].fine_1,
          date1: new Date(res.data[6].fine_1Dt),
          fine2: res.data[6].fine_2,
          date2: new Date(res.data[6].fine_2Dt),
          fine3: res.data[6].fine_3,
          date3: new Date(res.data[6].fine_3Dt)
        },
        {
          id: '4-2',
          date0: new Date(res.data[7].no_fine),
          fine1: res.data[7].fine_1,
          date1: new Date(res.data[7].fine_1Dt),
          fine2: res.data[7].fine_2,
          date2: new Date(res.data[7].fine_2Dt),
          fine3: res.data[7].fine_3,
          date3: new Date(res.data[7].fine_3Dt)
        }
      ];
      setFineRows(rows); 
    })
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Year - Semester',
      width: 135,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'date0',
      type: 'date',
      headerName: 'No Fine Date',
      width: 130,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          dayjs(params.value).format('DD MMM, YY')
        )
      }   
    },
    {
      field: 'fine1',
      headerName: 'Fine 1',
      width: 90,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          formatCost(params.value)
        )
      }
    },
    {
      field: 'date1',
      type: 'date',
      headerName: 'F1-Date',
      width: 130,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          dayjs(params.value).format('DD MMM, YY')
        )
      } 
    },
    {
      field: 'fine2',
      headerName: 'Fine 2',
      width: 90,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          formatCost(params.value)
        )
      }
    },
    {
      field: 'date2',
      type: 'date',
      headerName: 'F2-Date',
      width: 130,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          dayjs(params.value).format('DD MMM, YY')
        )
      } 
    },
    {
      field: 'fine3',
      headerName: 'Fine 3',
      width: 90,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          formatCost(params.value)
        )
      }
    },
    {
      field: 'date3',
      type: 'date',
      headerName: 'F3-Date',
      width: 130,
      editable: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return (
          dayjs(params.value).format('DD MMM, YY')
        )
      } 
    },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 80,
        cellClassName: 'actions',
        headerAlign: 'center',
        align: 'center',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
  
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
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
            />
          ];
        },
      },
    ];
  
  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
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

    const editedRow = fineRows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setFineRows(fineRows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setFineRows(fineRows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    let yearAndSemester = 'A';
    if(newRow.id == '1-1')
      yearAndSemester = 'A'
    else if(newRow.id == '1-2')
      yearAndSemester = 'B'
    else if(newRow.id == '2-1')
      yearAndSemester = 'C'
    else if(newRow.id == '2-2')
      yearAndSemester = 'D'
    else if(newRow.id == '3-1')
      yearAndSemester = 'E'
    else if(newRow.id == '3-2')
      yearAndSemester = 'F'
    else if(newRow.id == '4-1')
      yearAndSemester = 'G'
    else if(newRow.id == '4-2')
      yearAndSemester = 'H'
    console.log(dayjs(newRow.date0, "DD-MMM-YY"));
    Axios.patch(`api/cost/fines`, {
      semChar: yearAndSemester,
      fine1: newRow.fine1,
      fine2: newRow.fine2,
      fine3: newRow.fine3,
      nofinedate: '12-May-24',
      fine1date: '12-May-24',
      fine2date: '12-May-24',
      fine3date: '12-May-24'
    })
    .then(
      ({
        data: { done, error },
      }: {
        data: { done: boolean; error: string };
      }) => {
        if (done) {
          alert?.showAlert(`Succesfully updated`, "success");
        } else {
          alert?.showAlert(error,"error");
        }
      }
    )
    .catch(() =>
      alert?.showAlert("There was an error while connecting to the server.", "error")
    )
    .finally(() => loading?.showLoading(false));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <>
     <div className="flex justify-center mt-6">
       <h1 className='text-4xl my-6 text-blue-500 font-semibold'>Supplementary Fines</h1>
    </div>
    <div className='w-full max-w-screen-lg mx-auto'>
      <CustDataGrid
        style={{height: "auto",
        width: "100%",
        margin: "auto"}}
        rows={fineRows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        hideFooterSelectedRowCount
        hideFooterPagination
      />
    </div>
    </>
  );
}

export default function ManageCosts() {
  return (
    <>
      <Costs />
      <Fines />
    </>
  )
}