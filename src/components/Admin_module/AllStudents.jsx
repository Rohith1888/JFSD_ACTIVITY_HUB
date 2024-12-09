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
import VisibilityIcon from '@mui/icons-material/Visibility';


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
import axios from 'axios';
import '../css/Admin_Module/AllStudents.css';

import { Checkbox, FormControlLabel } from '@mui/material';

function EditToolbar(props) {
  const { setAddDialogOpen, handleRefresh } = props;

  const handleClick = () => {
    setAddDialogOpen(true);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Student
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
  const [newIdNumber, setNewIdNumber] = React.useState('');
  const [newEmail, setNewEmail] = React.useState('');
  const [confirmEmail, setConfirmEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const [editImageDialogOpen, setEditImageDialogOpen] = React.useState(false);
  const [editImage, setEditImage] = React.useState(null);
  const [editingRowId, setEditingRowId] = React.useState(null);
  const [eventDialogOpen, setEventDialogOpen] = React.useState(false);
  const [registeredEvents, setRegisteredEvents] = React.useState([]);
  const [currentEmail, setCurrentEmail] = React.useState('');
  const [allEvents, setAllEvents] = React.useState([]);
  const [selectedEvents, setSelectedEvents] = React.useState([]);
  const [addingEvents, setAddingEvents] = React.useState(false); 

  const handleToggleEvent = (eventId) => {
    setSelectedEvents((prevSelectedEvents) =>
      prevSelectedEvents.includes(eventId)
        ? prevSelectedEvents.filter((id) => id !== eventId)
        : [...prevSelectedEvents, eventId]
    );
  };

  const fetchStudents = () => {
    axios.get('https://jfsdactivityhubbackend-production.up.railway.app/student/all')
      .then(response => {
        const studentsWithIds = response.data.map((student, index) => ({
          id: student.email,
          serialNumber: index + 1,
          ...student,
        }));
        setRows(studentsWithIds);
      })
      .catch(error => {
        console.error('There was an error fetching the students!', error);
      });
  };

  
  React.useEffect(() => {
    fetchStudents();
  }, []);

  const handleRefresh = () => {
    fetchStudents();
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleRegisterEvents = async () => {
    try {
      await Promise.all(
        selectedEvents.map((eventId) =>
          axios.post(`https://jfsdactivityhubbackend-production.up.railway.app/registrations/${currentEmail}/register/${eventId}`)
        )
      );
      setEventDialogOpen(false); // Close the dialog after registration
      setSelectedEvents([]); // Reset selected events
    } catch (error) {
      console.error('Error registering events:', error);
    }
  };
  React.useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await axios.get('https://jfsdactivityhubbackend-production.up.railway.app/admin/getAllEvents');
        setAllEvents(response.data.filter(event => event.id)); // Ensure event has valid id
      } catch (error) {
        console.error('Error fetching all events:', error);
      }
    };
    
    fetchAllEvents();
  }, []);
  const handleViewRegisteredEvents = async (studentEmail) => {
    try {
      const response = await axios.get(`https://jfsdactivityhubbackend-production.up.railway.app/registrations/${studentEmail}`);
      const events = await Promise.all(
        response.data.map(async (registration) => {
          const eventResponse = await axios.get(`https://jfsdactivityhubbackend-production.up.railway.app/admin/getEvent/${registration.eventId}`);
          return { ...registration, eventName: eventResponse.data.eventName };
        })
      );
      setRegisteredEvents(events);
      setEventDialogOpen(true);
      setCurrentEmail(studentEmail);
    } catch (error) {
      console.error('Error fetching registered events:', error);
      toast.error('Unable to fetch registered events.');
    }
  };

  const handleSaveClick = (id) => () => {

    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View },
    }));
   
  };

  const handleAddRecord = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newIdNumber || !newEmail || !confirmEmail || !fullName || !password) {
     toast.error('Please fill all the fields.');
      return;
    }
  
    if (newEmail !== confirmEmail) {
      toast.error('Emails do not match.');  
      return;
    }
    if (!emailRegex.test(newEmail)) {
     toast.error('Invalid email address.');
      return;
    }
  
    axios.post('https://jfsdactivityhubbackend-production.up.railway.app/student/addStudent', {
      email: newEmail,
      fullName: fullName,
      idNumber: newIdNumber,
      password: password,
    })
      .then((response) => {
        toast.success('Student created successfully!');
        fetchStudents();
        setSelectedRowId(newEmail); // Select the newly created record
        // Clear input fields and close the dialog
        setNewIdNumber('');
        setNewEmail('');
        setConfirmEmail('');
        setFullName('');
        setPassword('');
        setAddDialogOpen(false);
      })
      .catch((error) => {
        console.error('Error adding student:', error);
        toast.error('There was an error adding the student.');
      });
  };

  const handleDeleteClick = (email) => () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (confirmDelete) {
    axios.delete(`https://jfsdactivityhubbackend-production.up.railway.app/student/deleteStudent`, { data: email })
      .then((response) => {
        toast.success('Student deleted successfully!');
        setRows((prevRows) => prevRows.filter((row) => row.email !== email));
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
        toast.error('There was an error deleting the student.');
      });
    }
  };
  const handleImageClick = (id, currentImage) => {
    setEditingRowId(id);
    setEditImage(currentImage);
    setEditImageDialogOpen(true);
  };
  const handleSaveImage = () => {
    if (!editImage) {
      toast.error('No image selected.');
      return;
    }

    const updatedRow = rows.find((row) => row.id === editingRowId);
    axios.put('https://jfsdactivityhubbackend-production.up.railway.app/student/updateStudent', {
      ...updatedRow,
      profileImage: editImage,
    })
      .then(() => {
        toast.success('Profile image updated successfully!');
        setEditImageDialogOpen(false);
        fetchStudents();
      })
      .catch((error) => {
        console.error('Error updating profile image:', error);
        toast.error('Error updating the profile image.');
      });
  };
  

  const processRowUpdate = async (updatedRow) => {
    try {
      await axios.put(`https://jfsdactivityhubbackend-production.up.railway.app/student/updateStudent`, updatedRow);
      toast.success('Student updated successfully!');
      fetchStudents();
      return updatedRow;
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('There was an error updating the student.');
      throw error;
    }
  };
  const handleCancelRegistration = (eventId, email) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this registration?');
    if (confirmCancel) {
      axios
        .post(`https://jfsdactivityhubbackend-production.up.railway.app/registrations/${email}/cancel/${eventId}`)
        .then((response) => {
          toast.success('Event registration canceled successfully!');
          setRegisteredEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventId)
          );
        })
        .catch((error) => {
          console.error('Error canceling registration:', error);
          toast.error('Failed to cancel registration.');
        });
    }
  };
  

  const columns = [
    { field: 'serialNumber', headerName: 'S.No', width: 80 },
    { field: 'idNumber', headerName: 'ID Number', width: 150, editable: true },
    
    { field: 'email', headerName: 'Email', width: 220, editable: false },
    { field: 'fullName', headerName: 'Full Name', width: 180, editable: true },
    { field: 'password', headerName: 'Password', width: 150, editable: true },
    { field: 'points', headerName: 'Points', width: 150, editable: true },
    { field: 'batch', headerName: 'Batch', width: 150, editable: true },
    { field: 'degree', headerName: 'Degree', width: 150, editable: true },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150, editable: true },
    {field:'club_id',headerName:'Joined Club ID',width:150,editable:true},
    {
      field: 'registeredEvents',
      headerName: 'Registered Events',
      width: 150,
      renderCell: (params) => (
        <VisibilityIcon
          style={{ cursor: 'pointer' }}
          onClick={() => handleViewRegisteredEvents(params.row.email)}
        />
      ),
    },
    {
      field: 'profileImage',
      headerName: 'Profile Image',
      width: 150,
      renderCell: (params) => (
        <img
          src={params.value ? `data:image/jpeg;base64,${params.value}` : 'default-image.jpg'}
          alt="Profile"
          style={{ width: '50px', height: '50px', cursor: 'pointer' }}
          onClick={() => handleImageClick(params.id, params.value)}
        />
      ),
    },

    
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id, row }) => {
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
            onClick={handleDeleteClick(row.email)}
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
        Students
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        selectionModel={selectedRowId ? [selectedRowId] : []} // Select new row
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
        <DialogTitle>Add New Record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ID Number"
            id='idNumber_field'
            type="text"
            fullWidth
            value={newIdNumber}
            required
            onChange={(e) => setNewIdNumber(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            id='email_field'
            fullWidth
            value={newEmail}
            required
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Confirm Email"
            type="email"
            fullWidth
            value={confirmEmail}
            required
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Full Name"
            type="text"
            id='fullName_field'
            fullWidth
            value={fullName}
            required
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="text"
            fullWidth
            id='password_field'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
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
       {/* Edit Image Dialog */}
       <Dialog open={editImageDialogOpen} onClose={() => setEditImageDialogOpen(false)}>
          <DialogTitle>Edit Profile Image</DialogTitle>
          <DialogContent>
            <img
              src={editImage ? `data:image/jpeg;base64,${editImage}` : 'default-image.jpg'}
              alt="Current Profile"
              style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
            />
            <Button variant="contained" component="label">
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setEditImage(reader.result.split(',')[1]);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditImageDialogOpen(false)} color="secondary" startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button onClick={handleSaveImage} color="primary" startIcon={<SaveIcon />}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)}>
      <DialogTitle>Registered Events</DialogTitle>
      <DialogContent>
        {registeredEvents.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Event Name</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Registration Time</th>
                <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registeredEvents.map((event) => (
                <tr key={event.id}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{event.eventName}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    {new Date(event.registrationTime).toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>
                    <Button
                      color="secondary"
                      onClick={() => handleCancelRegistration(event.eventId, currentEmail)}
                      startIcon={<DeleteIcon />}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Typography>No events registered.</Typography>
        )}

        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddingEvents(true)}
          style={{ marginTop: '20px' }}
        >
          Add Events
        </Button>

        {addingEvents && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h6">Select Events to Register</Typography>
            {allEvents.map((event) => (
              <FormControlLabel
                key={event.id}
                control={
                  <Checkbox
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => handleToggleEvent(event.id)}
                    name={event.eventName}
                  />
                }
                label={event.eventName}
              />
            ))}
            <Button
              onClick={handleRegisterEvents}
              color="primary"
              startIcon={<SaveIcon />}
              disabled={selectedEvents.length === 0} // Disable Save if no events are selected
              style={{ marginTop: '20px' }}
            >
              Save
            </Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEventDialogOpen(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>


    </Box>
    </>
  );
}