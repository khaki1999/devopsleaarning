import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Divider, Grid, TextField, Button, Typography, Box, Switch, FormControlLabel } from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

const Settings = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || '');

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('settings', JSON.stringify({ displayName, email, darkMode, apiUrl }));
      alert('Settings saved');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Breadcrumb title="Settings">
        <Typography variant="subtitle2" color="primary">
          Settings
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Application Settings" />
            <Divider />
            <CardContent>
              <Box component="form" onSubmit={handleSave}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="API URL" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={<Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />}
                      label="Dark mode"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained">
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Settings;










