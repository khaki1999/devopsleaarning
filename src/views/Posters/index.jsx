import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  CircularProgress,
  Avatar,
  Stack
} from '@mui/material';

import { Edit, Delete } from '@mui/icons-material';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import PostersForm from './PostersForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PosterService from '../../services/posterService/PosterService';

const Posters = () => {
  const [posters, setPosters] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editPoster, setEditPoster] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchPosters = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const postersData = await PosterService.fetchPosters();
      setPosters(postersData);
    } catch (error) {
      console.error('Failed to fetch posters', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleEdit = (poster) => {
    setEditPoster(poster);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await PosterService.deletePoster(id);
      fetchPosters();
    } catch (error) {
      console.error('Failed to delete poster', error);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditPoster(null);
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  return (
    <>
      <Breadcrumb title="Posters">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Posters
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Posters"
              action={
                <Button
                  onClick={() => setOpenDialog(true)}
                  variant="contained"
                  color="primary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    padding: '6px 16px',
                    textTransform: 'none',
                    fontSize: '14px',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.primary.dark
                    }
                  }}
                >
                  <AddCircleIcon />
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Add Poster
                  </Typography>
                </Button>
              }
            />
            <Divider />
            <CardContent>
              {loading ? (
                <Grid container justifyContent="center">
                  <CircularProgress />
                </Grid>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Poster Name</TableCell>
                        <TableCell align="center">Edit</TableCell>
                        <TableCell align="center">Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {posters.map((poster) => (
                        <TableRow key={poster._id}>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar variant="rounded" src={poster.imageUrl} sx={{ width: 56, height: 56 }} />
                              <Typography>{poster.posterName}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleEdit(poster)}>
                              <Edit />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleDelete(poster._id)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {posters.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No posters available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <PostersForm onClose={handleClose} fetchPosters={fetchPosters} editData={editPoster} />
      </Dialog>
    </>
  );
};

export default Posters;
