// React Components
import { useState } from 'react';
// MUI Components
import { Button, Container, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// Custom Components
import Title from "../../components/Title";

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
  }
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

export default function ManageCosts() {
  const [updateCosts, setUpdateCosts] = useState(false);
  return (
    <Container>
    <div className="flex justify-center">
      <Title title="Manage Costs" />
      <IconButton>
        <HelpIcon
        color = "primary"
        />
      </IconButton>
    </div>
    <Box sx={{ height: 350, width: '100%', background: 'white'}}>
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
      />
      <div className='flex justify-end'>
        <Button
        onClick={() => {
          setUpdateCosts(true);
        }}
        >
          Update Fine
        </Button>
      </div>
    </Box>
    {updateCosts && (
      <div>Hello there</div>
    )}
    </Container>
  )
}