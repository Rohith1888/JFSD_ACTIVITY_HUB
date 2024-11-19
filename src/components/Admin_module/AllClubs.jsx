import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

function EditToolbar(props) {
  const { setAddDialogOpen, handleRefresh } = props;

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
        Add Club
      </Button>
      <Button color="secondary" startIcon={<RefreshIcon />} onClick={handleRefresh}>
        Refresh
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [newClubName, setNewClubName] = React.useState('');
  const [newDescription, setNewDescription] = React.useState('');
  const [newNumberOfStudents, setNewNumberOfStudents] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('');
  const [selectedRowId, setSelectedRowId] = React.useState(null);

  const fetchClubs = () => {
    axios.get('http://localhost:8080/admin/getAllClubs')
      .then(response => {
        console.log(response.data);
        setRows(response.data);
      })
      .catch(error => {
        console.error('Error fetching clubs:', error);
      });
  };

  React.useEffect(() => {
    fetchClubs();
  }, []);

  const handleRefresh = () => {
    fetchClubs();
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View },
    }));
  };

  const handleAddRecord = () => {
    if (!newClubName || !newDescription || !newNumberOfStudents || !newCategory) {
      toast.error('Please fill all the fields.');
      return;
    }

    axios.post('http://localhost:8080/admin/addClub', {
      name: newClubName,
      description: newDescription,
      numberOfStudents: newNumberOfStudents,
      category: newCategory,
    })
      .then(() => {
        toast.success('Club added successfully!');
        fetchClubs();
        setAddDialogOpen(false);
        setNewClubName('');
        setNewDescription('');
        setNewNumberOfStudents('');
        setNewCategory('');
      })
      .catch(error => {
        console.error('Error adding club:', error);
        toast.error('There was an error adding the club.');
      });
  };

  const handleDeleteClick = (id) => () => {
    axios.delete(`http://localhost:8080/admin/deleteClub`, { data: { id: id } })
      .then((response) => {
        if (response.data === 'Club not found') {
          toast.error('Club not found');
        } else {
          toast.success('Club deleted successfully!');
          fetchClubs();
          setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        }
      })
      .catch((error) => {
        console.error('Error deleting club:', error);
        toast.error('There was an error deleting the club.');
      });
  };
  

  const processRowUpdate = async (updatedRow) => {
    try {
      await axios.put(`http://localhost:8080/admin/updateClub`, updatedRow);
      toast.success('Club updated successfully!');
      fetchClubs();
      return updatedRow;
    } catch (error) {
      console.error('Error updating club:', error);
      toast.error('There was an error updating the club.');
      throw error;
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, editable: false },
    { field: 'name', headerName: 'Club Name', width: 180, editable: true },
    { field: 'description', headerName: 'Description', width: 250, editable: true },
    { field: 'numberOfStudents', headerName: 'Number of Students', type: 'number', width: 180, editable: true },
    { field: 'category', headerName: 'Category', width: 180, editable: true, type: 'singleSelect', valueOptions: ['Tech', 'Non-Tech'] },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={() =>
                setRowModesModel((prevModel) => ({
                  ...prevModel,
                  [id]: { mode: GridRowModes.View, ignoreModifications: true },
                }))
              }
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() =>
              setRowModesModel((prevModel) => ({
                ...prevModel,
                [id]: { mode: GridRowModes.Edit },
              }))
            }
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          height: 650,
          width: '100%',
          '& .actions': { color: 'text.secondary' },
          '& .textPrimary': { color: 'text.primary' },
        }}
      >
        <Typography variant="h5" className="heading">
          Clubs
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          selectionModel={selectedRowId ? [selectedRowId] : []}
          onSelectionModelChange={(newSelection) => setSelectedRowId(newSelection[0])}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setAddDialogOpen, handleRefresh },
          }}
          getRowId={(row) => row.id}
        />
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
          <DialogTitle>Add New Club</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Club Name"
              type="text"
              fullWidth
              value={newClubName}
              onChange={(e) => setNewClubName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Number of Students"
              type="number"
              fullWidth
              value={newNumberOfStudents}
              onChange={(e) => setNewNumberOfStudents(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Category"
              select
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <MenuItem value="Tech">Tech</MenuItem>
              <MenuItem value="Non-Tech">Non-Tech</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddRecord} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
