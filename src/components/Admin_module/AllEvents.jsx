import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import 'react-toastify/dist/ReactToastify.css';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  
} from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

function EditToolbar({ setAddDialogOpen, handleRefresh }) {
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
        Add Event
      </Button>
      <Button color="secondary" startIcon={<RefreshIcon />} onClick={handleRefresh}>
        Refresh
      </Button>
    </GridToolbarContainer>
  );
}

export default function AllEvents() {
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [clubs, setClubs] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [newImage, setNewImage] = React.useState('');
  const [newEvent, setNewEvent] = React.useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    clubId: '',
    organizerEmail: '',
    points: '',
    penalty:'',
  });
  const [editingRowId, setEditingRowId] = React.useState(null);
  const [editImageDialogOpen, setEditImageDialogOpen] = React.useState(false);
  const [editImage, setEditImage] = React.useState('');
  const [registeredStudents, setRegisteredStudents] = React.useState([]);
const [viewStudentsDialogOpen, setViewStudentsDialogOpen] = React.useState(false);

const handleViewRegisteredStudents = async (eventId) => {
  try {
    const response = await axios.get(`https://jfsdactivityhubbackend-production.up.railway.app/registrations/events/${eventId}/students`);
    setRegisteredStudents(response.data);
    setViewStudentsDialogOpen(true);
  } catch (error) {
    console.error('Error fetching registered students:', error);
    toast.error("Failed to load students.");
  }
};


  // Fetch all events
  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('https://jfsdactivityhubbackend-production.up.railway.app/admin/getAllEvents');
      setRows(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events.');
    }
  };

  // Fetch all clubs
  const fetchClubs = async () => {
    try {
      const { data } = await axios.get('https://jfsdactivityhubbackend-production.up.railway.app/admin/getAllClubs');
      setClubs(data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      toast.error('Failed to fetch clubs.');
    }
  };

  React.useEffect(() => {
    fetchEvents();
    fetchClubs();
  }, []);

  // Fetch students for selected club
  const fetchStudents = async (clubId) => {
    if (!clubId) {
      setStudents([]);
      return;
    }
    try {
      const { data } = await axios.get(`https://jfsdactivityhubbackend-production.up.railway.app/admin/${clubId}/students`);
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students.');
    }
  };

  const handleRefresh = () => {
    fetchEvents();
  };

  const handleFileUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result.split(',')[1]); // Convert to base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEvent = async () => {
    const { name, description, date, time, venue, clubId, organizerEmail } = newEvent;

    if (!name || !description || !date || !time || !venue || !clubId || !organizerEmail || !newImage) {
      toast.error('Please fill all fields and upload an image.');
      return;
    }

    try {
      const response = await axios.post('https://jfsdactivityhubbackend-production.up.railway.app/admin/addEvent', {
        eventName: name,
        eventDescription: description,
        eventDate: date,
        eventTime: time,
        eventVenue: venue,
        clubId,
        organizerEmail,
        eventImage: newImage,
      });

      if (response.data === 'Event already exists') {
        toast.error('Event already exists.');
      } else {
        toast.success('Event added successfully!');
        fetchEvents();
        setAddDialogOpen(false);
        setNewEvent({
          name: '',
          description: '',
          date: '',
          time: '',
          venue: '',
          clubId: '',
          organizerEmail: '',
        });
        setNewImage('');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event.');
    }
  };

  const handleDeleteClick = (id) => async () => {
    try {
      await axios.delete(`https://jfsdactivityhubbackend-production.up.railway.app/admin/deleteEvent/${id}`);
      toast.success('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event.');
    }
  };

  const handleImageClick = (id, currentImage) => {
    setEditingRowId(id);
    setEditImage(currentImage);
    setEditImageDialogOpen(true);
  };

  const handleSaveImage = async () => {
    const updatedRow = rows.find((row) => row.id === editingRowId);
    updatedRow.eventImage = editImage;

    try {
      await axios.put('https://jfsdactivityhubbackend-production.up.railway.app/admin/updateEvent', updatedRow);
      toast.success('Event image updated successfully!');
      fetchEvents();
      setEditImageDialogOpen(false);
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image.');
    }
  };

  const processRowUpdate = async (updatedRow) => {
    try {
      await axios.put('https://jfsdactivityhubbackend-production.up.railway.app/admin/updateEvent', updatedRow);
      toast.success('Event updated successfully!');
      fetchEvents();
      return updatedRow;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event.');
      throw error;
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'eventName', headerName: 'Event Name', width: 200, editable: true },
    { field: 'eventDescription', headerName: 'Description', width: 300, editable: true },
    { field: 'eventDate', headerName: 'Date', width: 150, editable: true },
    { field: 'eventTime', headerName: 'Time', width: 150, editable: true },
    { field: 'eventVenue', headerName: 'Venue', width: 200, editable: true },
    { field: 'points', headerName: 'Points Gain', width: 200, editable: true },
    { field: 'penalty', headerName: 'Penalty Points', width: 200, editable: true },
    { field: 'clubId', headerName: 'Club ID', width: 150, editable: true },
    { field: 'organizerEmail', headerName: 'Organizer Email', width: 200, editable: true },
    {
      field: 'eventImage',
      headerName: 'Event Image',
      width: 150,
      renderCell: (params) => (
        <img
          src={params.value ? `data:image/jpeg;base64,${params.value}` : 'default-image.jpg'}
          alt="Event"
          style={{ width: '50px', height: '50px', cursor: 'pointer' }}
          onClick={() => handleImageClick(params.id, params.value)}
        />
      ),
    },
    {
      field: 'studentsRegistered',  // Add a new field for the Eye icon
      headerName: 'Students Registered',
      width: 150,
      renderCell: (params) => (
        <VisibilityIcon
          style={{ cursor: 'pointer' }}
          onClick={() => handleViewRegisteredStudents(params.id)}  // Trigger the event fetch on click
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => console.log('Edit clicked')}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />,
      ],
    },
  ];
  return (
    <>
      <ToastContainer />
      <Box sx={{ height: 650, width: '100%' }}>
        <Typography variant="h5" className="heading">Events</Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: EditToolbar }}
          slotProps={{ toolbar: { setAddDialogOpen, handleRefresh } }}
        />
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
  <DialogTitle>Add Event</DialogTitle>
  <DialogContent>
    {/* Event Name */}
    <TextField
      label="Event Name"
      fullWidth
      required
      value={newEvent.name}
      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
      style={{ marginBottom: '15px' }}
    />
    
    {/* Club Dropdown */}
    <TextField
      select
      label="Club"
      fullWidth
      required
      value={newEvent.clubId}
      onChange={(e) => {
        setNewEvent({ ...newEvent, clubId: e.target.value });
        fetchStudents(e.target.value);
      }}
      style={{ marginBottom: '15px' }}
    >
      {clubs.map((club) => (
        <MenuItem key={club.id} value={club.id}>
          {club.name}
        </MenuItem>
      ))}
    </TextField>
    
    {/* Organizer Email Dropdown */}
    <TextField
      select
      label="Organizer"
      fullWidth
      required
      value={newEvent.organizerEmail}
      onChange={(e) => setNewEvent({ ...newEvent, organizerEmail: e.target.value })}
      style={{ marginBottom: '15px' }}
    >
      {students.length > 0 ? (
        students.map((student) => (
          <MenuItem key={student.email} value={student.email}>
            {student.fullName}
          </MenuItem>
        ))
      ) : (
        <MenuItem>No Students Available</MenuItem>
      )}
    </TextField>

    {/* Description */}
    <TextField
      label="Description"
      fullWidth
      required
      value={newEvent.description}
      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
      style={{ marginBottom: '15px' }}
    />

    {/* Event Date */}
    <TextField
      type="date"
      label="Date"
      fullWidth
      required
      value={newEvent.date}
      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
      InputLabelProps={{ shrink: true }}
      style={{ marginBottom: '15px' }}
    />

    {/* Event Time */}
    <TextField
      type="time"
      label="Time"
      fullWidth
      required
      value={newEvent.time}
      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
      InputLabelProps={{ shrink: true }}
      style={{ marginBottom: '15px' }}
    />

    {/* Venue */}
    <TextField
      label="Venue"
      fullWidth
      required
      value={newEvent.venue}
      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
      style={{ marginBottom: '15px' }}
    />

    {/* Points */}
    <TextField
      label="Points"
      fullWidth
      required
      value={newEvent.points}
      onChange={(e) => setNewEvent({ ...newEvent, points: e.target.value })}
      style={{ marginBottom: '15px' }}
      type="number"
    />

    {/* Penalty */}
    <TextField
      label="Penalty"
      fullWidth
      required
      value={newEvent.penalty}
      onChange={(e) => setNewEvent({ ...newEvent, penalty: e.target.value })}
      style={{ marginBottom: '15px' }}
      type="number"
    />

    {/* Image Upload */}
    <Button variant="contained" required component="label">
      Upload Event Image
      <input type="file" hidden onChange={(e) => handleFileUpload(e, setNewImage)} />
    </Button>
    {newImage && <img src={`data:image/jpeg;base64,${newImage}`} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
    <Button onClick={handleAddEvent}>Add</Button>
  </DialogActions>
</Dialog>

<Dialog open={editImageDialogOpen} onClose={() => setEditImageDialogOpen(false)}>
  <DialogTitle>Edit Event Image</DialogTitle>
  <DialogContent>
    {/* Current Image Preview */}
    <img src={`data:image/jpeg;base64,${editImage}`} alt="Event Preview" style={{ width: '100%', marginBottom: '10px' }} />
    
    {/* New Image Upload */}
    <Button variant="contained" component="label">
      Upload New Image
      <input type="file" hidden onChange={(e) => handleFileUpload(e, setEditImage)} />
    </Button>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setEditImageDialogOpen(false)}>Cancel</Button>
    <Button onClick={handleSaveImage}>Save</Button>
  </DialogActions>
</Dialog>
<Dialog open={viewStudentsDialogOpen} onClose={() => setViewStudentsDialogOpen(false)}>
  <DialogTitle>Registered Students</DialogTitle>
  <DialogContent>
    {registeredStudents.length > 0 ? (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Full Name</th>
            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {registeredStudents.map((student) => (
            <tr key={student.email}>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{student.fullName}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{student.studentEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <Typography>No students registered for this event.</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setViewStudentsDialogOpen(false)}>Close</Button>
  </DialogActions>
</Dialog>


      </Box>
    </>
  );
}
