import React from 'react';
import { Typography, Grid, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ScreenGrid from '../components/ScreenGrid.tsx';
import UserTable from './UserTable.tsx';
import InviteUserButton from '../components/buttons/InviteUserButton.tsx';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AdminDashboardPage() {
  return (
    <ScreenGrid>
      <Grid item>
        <Typography variant="h2">Welcome to the Admin Dashboard</Typography>
      </Grid>
      <Grid item container width="60vw" justifyContent="flex-end" spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/album-upload"
            startIcon={<CloudUploadIcon />}
          >
            Upload Album
          </Button>
        </Grid>
        <Grid item>
          <InviteUserButton />
        </Grid>
      </Grid>
      <Grid item>
        <div style={{ height: '60vh', width: '60vw' }}>
          <UserTable />
        </div>
      </Grid>
    </ScreenGrid>
  );
}

export default AdminDashboardPage;
