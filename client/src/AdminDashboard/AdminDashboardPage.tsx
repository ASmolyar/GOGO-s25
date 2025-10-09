import React from 'react';
import { Typography, Grid, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LogoutIcon from '@mui/icons-material/Logout';
import ScreenGrid from '../components/ScreenGrid.tsx';
import UserTable from './UserTable.tsx';
import InviteUserButton from '../components/buttons/InviteUserButton.tsx';
import { useAppDispatch } from '../util/redux/hooks.ts';
import { logout } from '../util/redux/userSlice.ts';
import { logout as logoutApi } from '../Home/api.tsx';

/**
 * A page only accessible to admins that displays all users in a table and allows
 * Admin to delete users from admin and promote users to admin.
 */
function AdminDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    if (await logoutApi()) {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  return (
    <ScreenGrid>
      <Grid item>
        <Typography variant="h2">Welcome to the Admin Dashboard</Typography>
      </Grid>
      <Grid
        item
        container
        width="60vw"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid item>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Grid>
        <Grid item container spacing={2} justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/album-upload"
              startIcon={<CloudUploadIcon />}
            >
              Customize Impact Report
            </Button>
          </Grid>
          <Grid item>
            <InviteUserButton />
          </Grid>
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
