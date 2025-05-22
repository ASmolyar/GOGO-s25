import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFoundPage from './NotFound/NotFoundPage.tsx';
import HomePage from './Home/HomePage.tsx';
import AdminDashboardPage from './AdminDashboard/AdminDashboardPage.tsx';
import {
  UnauthenticatedRoutesWrapper,
  ProtectedRoutesWrapper,
  DynamicRedirect,
  AdminRoutesWrapper,
} from './util/routes.tsx';
import VerifyAccountPage from './Authentication/VerifyAccountPage.tsx';
import RegisterPage from './Authentication/RegisterPage.tsx';
import LoginPage from './Authentication/LoginPage.tsx';
import EmailResetPasswordPage from './Authentication/EmailResetPasswordPage.tsx';
import ResetPasswordPage from './Authentication/ResetPasswordPage.tsx';
import AlertPopup from './components/AlertPopup.tsx';
import InviteRegisterPage from './Authentication/InviteRegisterPage.tsx';
import ImpactReportPage from './ImpactReport/ImpactReportPage.tsx';
import MusicPage from './ImpactReport/MusicPage.tsx';
import ArtistView from './ImpactReport/components/ArtistView.tsx';
import MapDemo from './ImpactReport/components/map/MapDemo';
import Impact from './ImpactReport/components/Impact';
import AlbumUploadPage from './AdminDashboard/AlbumUploadPage.tsx';
import './assets/fonts/fonts.css';

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#000000' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#000000',
        }}
      >
        <AlertPopup />
        <Routes>
          {/* Routes accessed only if user is not authenticated */}
          <Route element={<UnauthenticatedRoutesWrapper />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/verify-account/:token"
              element={<VerifyAccountPage />}
            />
            <Route path="/email-reset" element={<EmailResetPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
          </Route>
          <Route path="/invite/:token" element={<InviteRegisterPage />} />
          <Route path="/album-upload" element={<AlbumUploadPage />} />
          <Route path="/impact-report" element={<ImpactReportPage />} />
          {/* Routes accessed only if user is authenticated */}
          <Route element={<ProtectedRoutesWrapper />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
          <Route element={<AdminRoutesWrapper />}>
            <Route path="/users" element={<AdminDashboardPage />} />
          </Route>
          {/* Impact Report (Spotify-style) route */}

          {/* Route which redirects to a different page depending on if the user is an authenticated or not by utilizing the DynamicRedirect component */}
          <Route
            path="/"
            element={<DynamicRedirect unAuthPath="/login" authPath="/home" />}
          />
          {/* Route which is accessed if no other route is matched */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
