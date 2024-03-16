// React Components
import { useState, useEffect } from 'react';
// MUI Components
import { Container, IconButton } from '@mui/material';
import { Container, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import Box from '@mui/material/Box';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
// Custom Components
import Title from "../../components/Title";
import Axios from 'axios';

export default function ManageCosts() {
  const [suppleBaseCost, setSuppleBaseCost] = useState(0);
  const [suppleAddCost, setSuppleAddCost] = useState(0);
  const [suppleMaxCost, setSuppleMaxCost] = useState(0);
  const [revalCost, setRevalCost] = useState(0);
  const [writtenBaseCost, setWrittenBaseCost] = useState(0);
  const [writtenAddCost, setWrittenAddCost] = useState(0);
  const [writtenMaxCost, setWrittenMaxCost] = useState(0);
  const [fine1, setFine1] = useState(0);
  const [fine2, setFine2] = useState(0);
  const [fine3, setFine3] = useState(0);
  const [activeFine, setActiveFine] = useState('Fine 1');

  useEffect(() => {
    Axios.get(`api/cost/costs?module=cbt`)
    .then((res) => {
      setWrittenBaseCost(res.data["cbc"]);
      setWrittenAddCost(res.data["cac"]);
      setWrittenMaxCost(res.data["cfc"]);
    })
    Axios.get(`api/cost/costs?module=reval`)
    .then((res) => {
      setRevalCost(res.data["rev"]);
    })
    Axios.get(`api/cost/costs?module=supple`)
  })

const d1 = new Date("2024-03-14");
const d2 = new Date("2024-03-20");
const d3 = new Date("2024-03-25");

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Exam',
    width: 300,
    editable: false
  },
  {
    field: 'basecost',
    headerName: 'Base Cost',
    width: 300,
    editable: true
  },
  {
    field: 'additionalcost',
    headerName: 'Addtional Cost',
    width: 300,
    editable: true
  },
  {
    field: 'maxcost',
    headerName: 'Max Cost',
    width: 100,
    editable: true
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: () => {
      //const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (true) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            sx={{
              color: 'primary.main',
            }}
            // onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            // onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          // onClick={handleEditClick(id)}
          color="inherit"
        />
      ];
    },
  },
]

const supplementaryCols: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Exam Name',
    width: 200,
    editable: false
  },
  {
    field: 'fine1',
    headerName: 'Fine 1',
    width: 100,
    editable: true
  },
  {
    field: 'date1',
    type: 'date',
    headerName: 'Date',
    width: 150,
    editable: true
  },
  {
    field: 'fine2',
    headerName: 'Fine 2',
    width: 100,
    editable: true
  },
  {
    field: 'date2',
    type: 'date',
    headerName: 'Date',
    width: 150,
    editable: true
  },
  {
    field: 'fine3',
    headerName: 'Fine 3',
    width: 100,
    editable: true
  },
  {
    field: 'date3',
    type: 'date',
    headerName: 'Date',
    width: 150,
    editable: false
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: () => {
      //const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (true) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            sx={{
              color: 'primary.main',
            }}
            // onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            // onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          // onClick={handleEditClick(id)}
          color="inherit"
        />
      ];
    },
  },
]

const rows = [
  {
    id: 'Supplementary',
    basecost: 900,
    additionalcost: 200,
    maxcost: 1100
  },
  {
    id: 'Revaluation',
    basecost: 1000,
    additionalcost: 'NA',
    maxcost: 1000
  },
  {
    id: 'Written Test',
    basecost: 200,
    additionalcost: 100,
    maxcost: 500
  }
]

const supplementaryRows = [
  {
    id: 'Supplemenatary Exam',
    fine1: 100,
    date1: d1,
    fine2: 200,
    date2: d2,
    fine3: 500,
    date3: d3
  }
]

export default function ManageCosts() {
  // const [updateCosts, setUpdateCosts] = useState(false);
  // Effects
  useEffect(() => {
    
  })
  return (
    <>
    <>
    <Container>
    <div className="flex justify-center">
      <Title title="Manage Costs" />
      <IconButton>
        <HelpIcon
        color = "primary"
        />
      </IconButton>
    </div>
    <Box sx={{ height: 266, width: '100%', background: 'white'}}>
    <Box sx={{ height: 250, width: '100%', background: 'white'}}>
      <DataGrid 
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[3]}
        hideFooterPagination
        hideFooterSelectedRowCount
      />
    </Box>
    </Container>
    <Container sx={{marginTop: 5}}>
    <Title title="Update Fines" />
    <Box sx={{ height: 162, width: '100%', background: 'white'}}>
      <DataGrid 
        rows={supplementaryRows}
        columns={supplementaryCols}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[3]}
        hideFooterPagination
        hideFooterSelectedRowCount
      />
    </Box>
    </Container>
    </>
  )
}