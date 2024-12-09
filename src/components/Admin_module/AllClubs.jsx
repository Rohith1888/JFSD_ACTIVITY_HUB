import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  GridRowModes,
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
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FormControlLabel, Checkbox } from '@mui/material';
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
 
  const [newCategory, setNewCategory] = React.useState('');
  const [newImage, setNewImage] = React.useState('');
  const [editImageDialogOpen, setEditImageDialogOpen] = React.useState(false);
  const [editImage, setEditImage] = React.useState('');
  const [editingRowId, setEditingRowId] = React.useState(null);
  const[newVenue,setNewVenue]=React.useState('');
  const[newClubEmail,setNewClubEmail]=React.useState('');
  const [studentsList, setStudentsList] = React.useState([]);
const [studentsDialogOpen, setStudentsDialogOpen] = React.useState(false);
const [selectedClubIdForAdd, setSelectedClubIdForAdd] = React.useState(null);



  // Fetch clubs from server
  const fetchClubs = () => {
    axios
      .get('https://jfsdactivityhubbackend-production.up.railway.app/admin/getAllClubs')
      .then((response) => {
        const clubs = response.data;
  
        // For each club, fetch the number of students
        const clubsWithStudents = clubs.map((club) => {
          return axios
            .get(`https://jfsdactivityhubbackend-production.up.railway.app/admin/${club.id}/students`)
            .then((studentsResponse) => {
              return {
                ...club,
                numberOfStudents: studentsResponse.data.length, // Set the number of students
              };
            })
            .catch((error) => {
              console.error(`Error fetching students for club ${club.id}:`, error);
              return {
                ...club,
                numberOfStudents: 0, // Default to 0 if there's an error
              };
            });
        });
  
        // Wait for all promises to resolve
        Promise.all(clubsWithStudents)
          .then((updatedClubs) => {
            setRows(updatedClubs); // Update the state with clubs including the number of students
          })
          .catch((error) => {
            console.error('Error fetching clubs:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching clubs:', error);
      });
  };
  

  React.useEffect(() => {
    fetchClubs();
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchClubs();
  };

  // Add new club
  const handleAddRecord = () => {
    if (!newClubName || !newDescription || !newCategory || !newImage) {
      toast.error('Please fill all the fields and upload an image.');
      return;
    }
  
    axios
      .post('https://jfsdactivityhubbackend-production.up.railway.app/admin/addClub', {
        name: newClubName,
        description: newDescription,
        category: newCategory,
        clubImage: newImage,
        venue: newVenue,
        clubMail: newClubEmail,
      })
      .then((response) => {
        // Check if the club already exists based on the response from the server
        if (response.data === 'Club already exists') {
          toast.error('Club already exists.');
        } else {
          // Success case: Clear all fields and close the dialog
          fetchClubs(); // Reload the clubs list
          setAddDialogOpen(false); // Close the add dialog
          setNewClubName(''); // Clear club name
          setNewDescription(''); // Clear description
          setNewCategory(''); // Clear category
          setNewImage(''); // Clear image
          setNewVenue(''); // Clear venue
          setNewClubEmail(''); // Clear club email
          toast.success('Club added successfully!');
        }
      })
      .catch((error) => {
        console.error('Error adding club:', error);
        toast.error('There was an error adding the club.');
      });
  };
  
  // Delete a club
  const handleDeleteClick = (id) => () => {
    axios
      .delete(`https://jfsdactivityhubbackend-production.up.railway.app/admin/deleteClub`, { data: { id } })
      .then((response) => {
        if (response.data === 'Club not found') {
          toast.error('Club not found');
        } else {
          toast.success('Club deleted successfully!');
          fetchClubs();
        }
      })
      .catch((error) => {
        console.error('Error deleting club:', error);
        toast.error('There was an error deleting the club.');
      });
  };

  // Update club details
  const processRowUpdate = async (updatedRow) => {
    try {
      await axios.put(`https://jfsdactivityhubbackend-production.up.railway.app/admin/updateClub`, updatedRow);
      toast.success('Club updated successfully!');
      fetchClubs();
      return updatedRow;
    } catch (error) {
      console.error('Error updating club:', error);
      toast.error('There was an error updating the club.');
      throw error;
    }
  };

  // Handle file upload and convert to Base64
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

  // Handle image click for editing
  const handleImageClick = (id, currentImage) => {
    setEditingRowId(id);
    setEditImage(currentImage);
    setEditImageDialogOpen(true);
  };

  // Save edited image
  const handleSaveImage = () => {
    const updatedRow = rows.find((row) => row.id === editingRowId);
    updatedRow.clubImage = editImage;

    axios
      .put(`https://jfsdactivityhubbackend-production.up.railway.app/admin/updateClub`, updatedRow)
      .then(() => {
        toast.success('Club image updated successfully!');
        fetchClubs();
        setEditImageDialogOpen(false);
      })
      .catch((error) => {
        console.error('Error updating image:', error);
        toast.error('Failed to update image.');
      });
  };
  const handleViewAllStudents = async (clubId) => {
    try {
      const response = await axios.get(`https://jfsdactivityhubbackend-production.up.railway.app/admin/${clubId}/students`);
      setSelectedClubIdForAdd(clubId); // Store the club ID for adding students
      setStudentsList(response.data); // Store the students data in state
      setStudentsDialogOpen(true); // Open the students dialog
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };


  const StudentsDialog = ({ open, onClose, students, clubId, handleViewAllStudents }) => {
    const [availableStudents, setAvailableStudents] = React.useState([]);
    const [selectedStudents, setSelectedStudents] = React.useState([]);
  
    React.useEffect(() => {
      if (open) {
        const fetchAvailableStudents = async () => {
          try {
            const response = await axios.get("https://jfsdactivityhubbackend-production.up.railway.app/student/all");
            const studentsWithNoClub = response.data.filter(student => student.club_id === null);
            setAvailableStudents(studentsWithNoClub);
          } catch (error) {
            console.error("Error fetching students:", error);
          }
        };
        fetchAvailableStudents();
      }
    }, [open]);
  
    const handleDeleteStudent = async (email) => {
      try {
        await axios.post(`https://jfsdactivityhubbackend-production.up.railway.app/student/${email}/leave`);
        toast.success(`Student ${email} removed from the club!`);
        
        // Remove the student from the local students list
        
        handleViewAllStudents(selectedClubIdForAdd); // Refresh students list
      } catch (error) {
        console.error("Error deleting student: ", error);
        toast.error("Failed to remove student");
      }
    };
  
    const handleAddStudents = async () => {
      try {
        if (selectedStudents.length > 0) {
          await Promise.all(selectedStudents.map(async (email) => {
            await axios.post(`https://jfsdactivityhubbackend-production.up.railway.app/student/${email}/join/${selectedClubIdForAdd}`);
            
            
          }));
          toast.success("Selected students added to the club!");
          handleViewAllStudents(clubId); // Refresh students list
          setSelectedStudents([]); // Clear selected students
          onClose(); // Close the dialog
        } else {
          toast.error("Please select at least one student.");
        }
      } catch (error) {
        console.error("Error adding students:", error);
        toast.error("Failed to add students");
        console.log(clubId);
        
      }
    };
  
    const handleToggleStudent = (email) => {
      setSelectedStudents(prevSelected => {
        if (prevSelected.includes(email)) {
          return prevSelected.filter(e => e !== email); // Remove from selected if already selected
        } else {
          return [...prevSelected, email]; // Add to selected
        }
      });
    };
  
    return (
      <>
        <ToastContainer />
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Students List</DialogTitle>
          <DialogContent>
            {students && students.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Mail</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Full Name</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>ID Number</th>
                    <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{student.email}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{student.fullName}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{student.idNumber}</td>
                      <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>
                        <Button
                          color="secondary"
                          onClick={() => handleDeleteStudent(student.email)}
                          startIcon={<DeleteIcon />}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Typography>No students joined.</Typography>
            )}
  
            {/* Dropdown for adding new students */}
            <TextField
              select
              label="Select Students to Add"
              multiple
              value={selectedStudents}
              onChange={(e) => setSelectedStudents(e.target.value)}
              fullWidth
              style={{ marginTop: '15px' }}
              SelectProps={{
                renderValue: (selected) => {
                  return selected.join(', ');
                }
              }}
            >
              {availableStudents.map((student) => (
                <MenuItem key={student.email} value={student.email}>
                  {student.fullName} - {student.email}
                </MenuItem>
              ))}
            </TextField>
  
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6">Select Students to Register</Typography>
              {availableStudents.map((student) => (
                <FormControlLabel
                  key={student.email}
                  control={
                    <Checkbox
                      checked={selectedStudents.includes(student.email)}
                      onChange={() => handleToggleStudent(student.email)}
                      name={student.fullName}
                    />
                  }
                  label={student.fullName}
                />
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={handleAddStudents} color="primary" disabled={selectedStudents.length === 0}>
              Add Students
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  
  // Define columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 100, editable: false, height: 100 },
    { field: 'name', headerName: 'Club Name', width: 200, editable: true },
    { field: 'description', headerName: 'Description', width: 250, editable: true },
    {field: 'venue', headerName: 'Venue', width: 180, editable: true },
    {field: 'clubMail', headerName: 'Club Email', width: 180, editable: true },
    { field: 'numberOfStudents', headerName: 'Number of Students', type: 'number', width: 180, editable: true },
    {
      field: 'viewAllStudents',
      headerName: 'View Students',
      width: 150,
      renderCell: (params) => (
        <VisibilityIcon
          style={{ cursor: 'pointer' }}
          onClick={() => handleViewAllStudents(params.row.id)} // Trigger function to view students
        />
      ),
    },
    { field: 'category', headerName: 'Category', width: 180, editable: true },
    {
      field: 'clubImage',
      headerName: 'Club Image',
      width: 150,
      renderCell: (params) => (
        <img
          src={params.value ? `data:image/jpeg;base64,${params.value}` : 'default-image.jpg'}
          alt="Club"
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
            onClick={handleDeleteClick(row.id)}
            color="inherit"
          />,
        ];
      },

    },
  ];
  const handleSaveClick = (id) => () => {

    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View },
    }));
   
  };
  return (
    <>
      <ToastContainer style={{ margin: '0px' }} />
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
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: EditToolbar }}
          slotProps={{ toolbar: { setAddDialogOpen, handleRefresh } }}
        />
        <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
          <DialogTitle>Add New Club</DialogTitle>
          <DialogContent> 
            <TextField label="Club Name" required fullWidth value={newClubName} onChange={(e) => setNewClubName(e.target.value)} style={{ marginBottom: '15px', marginTop:'5px' }} />
            <TextField label="Description" required fullWidth value={newDescription} onChange={(e) => setNewDescription(e.target.value)} style={{ marginBottom: '15px' }} />
            <TextField select label="Category" required  value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ marginBottom: '15px' , width: '150px', marginRight:'5px'}}>
              <MenuItem value="Tech">Tech</MenuItem>
              <MenuItem value="Non-Tech">Non-Tech</MenuItem>
              <MenuItem value="Sports">Sports</MenuItem>
            </TextField>
            <TextField label="Venue" required  value={newVenue} onChange={(e) => setNewVenue(e.target.value)} style={{ marginBottom: '15px', width: '397px' }} />
            <TextField label="Club Email"required fullWidth value={newClubEmail} onChange={(e) => setNewClubEmail(e.target.value)}  type='email' style={{marginBottom:'25px'}}/>
            <Button variant="contained" required component="label">
              Upload Club Image
              <input type="file" hidden onChange={(e) => handleFileUpload(e, setNewImage)} />
            </Button>
            {newImage && <img src={`data:image/jpeg;base64,${newImage}`} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRecord}>Save</Button>
          </DialogActions>
        </Dialog>
        <StudentsDialog
        open={studentsDialogOpen}
        onClose={() => setStudentsDialogOpen(false)}
        students={studentsList}
        handleViewAllStudents={handleViewAllStudents}
      />
        <Dialog open={editImageDialogOpen} onClose={() => setEditImageDialogOpen(false)}>
          <DialogTitle>Edit Club Image</DialogTitle>
          <DialogContent>
            <img src={`data:image/jpeg;base64,${editImage}`} alt="Club Preview" style={{ width: '100%', marginBottom: '10px' }} />
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
      </Box>
    </>
  );
}
