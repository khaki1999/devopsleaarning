import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationForm from './NotificationsForm';
import { format } from 'date-fns';
import NotificationService from '../../services/notificationService/NotificationService';

const Notification = () => {
  const [openForm, setOpenForm] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchNotifications = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const notificationsData = await NotificationService.fetchNotifications();
      setNotifications(notificationsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleOpenForm = () => {
    setEditMode(false);
    setCurrentNotification(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditMode(false);
    setCurrentNotification(null);
  };

  const handleAddOrUpdateNotification = async (formData) => {
    try {
      if (editMode && currentNotification) {
        await NotificationService.updateNotification(currentNotification._id, formData);
      } else {
        await NotificationService.addNotification(formData);
      }
      fetchNotifications();
      handleCloseForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await NotificationService.deleteNotification(id);
        fetchNotifications();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleView = (notif) => {
    setCurrentNotification(notif);
    setViewOpen(true);
  };

  const handleCloseView = () => {
    setViewOpen(false);
    setCurrentNotification(null);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <Breadcrumb title="Notification">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Notification
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={<Typography variant="h6">Notifications</Typography>}
              action={
                <Button
                  onClick={handleOpenForm}
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
                    Send Notification
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">All Notifications</Typography>
                  </Grid>
                  {notifications.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="body1" color="textSecondary">
                        No notifications available.
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Typography>
                            <strong>Title</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>
                            <strong>Description</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography>
                            <strong>Date</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography>
                            <strong>View</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography>
                            <strong>Delete</strong>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider />
                      {notifications.map((notif, index) => (
                        <Grid item xs={12} key={index}>
                          <Grid container spacing={2}>
                            <Grid item xs={3}>
                              <Typography>{notif.title}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <Typography>{notif.description}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography>{format(new Date(notif.createdAt), 'dd/MM/yyyy HH:mm')}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton onClick={() => handleView(notif)}>
                                <VisibilityIcon />
                              </IconButton>
                            </Grid>
                            <Grid item xs={2}>
                              <IconButton onClick={() => handleDelete(notif._id)}>
                                <DeleteIcon style={{ color: 'red' }} />
                              </IconButton>
                            </Grid>
                          </Grid>
                          <Divider />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <NotificationForm
          onClose={handleCloseForm}
          onSubmit={handleAddOrUpdateNotification}
          editMode={editMode}
          notification={currentNotification}
        />
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleCloseView}>
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent>
          {currentNotification && (
            <>
              <Typography>
                <strong>Title:</strong> {currentNotification.title}
              </Typography>
              <Typography>
                <strong>Description:</strong> {currentNotification.description}
              </Typography>
              <Typography>
                <strong>Sent on:</strong> {format(new Date(currentNotification.createdAt), 'dd/MM/yyyy HH:mm')}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Notification;
