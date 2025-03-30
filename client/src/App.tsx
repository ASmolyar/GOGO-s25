import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import theme from './assets/theme.ts';
import { store, persistor } from './util/redux/store.ts';
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
import appLogo from './assets/gogoWithoutBkg.png';
import MainTitle from './components/Title.tsx';
import Impact from './components/impact.tsx';
import ImpactReportPage from './ImpactReport/ImpactReportPage.tsx';

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#000000' }}>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              <CssBaseline>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  width: '100%',
                  backgroundColor: '#000000'
                }}>
                  <AlertPopup />
                  <MainTitle
                    title="YEARLY IMPACT REPORT" 
                    imageSrc={appLogo}
                    imageAlt="Application Logo"
                    animationDuration={3.5}
                  />
                  <Routes>
                    {/* Routes accessed only if user is not authenticated */}
                    <Route element={<UnauthenticatedRoutesWrapper />}>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route
                        path="/verify-account/:token"
                        element={<VerifyAccountPage />}
                      />
                      <Route
                        path="/email-reset"
                        element={<EmailResetPasswordPage />}
                      />
                      <Route
                        path="/reset-password/:token"
                        element={<ResetPasswordPage />}
                      />
                    </Route>
                    <Route
                      path="/invite/:token"
                      element={<InviteRegisterPage />}
                    />
                    {/* Routes accessed only if user is authenticated */}
                    <Route element={<ProtectedRoutesWrapper />}>
                      <Route path="/home" element={<HomePage />} />
                    </Route>
                    <Route element={<AdminRoutesWrapper />}>
                      <Route path="/users" element={<AdminDashboardPage />} />
                    </Route>

                  {/* SpotifyNav route */}
                  {/* <Route path="/spotify" element={<SpotifyNav />} /> */}

                  {/* Route which redirects to a different page depending on if the user is an authenticated or not by utilizing the DynamicRedirect component */}
                  <Route
                    path="/"
                    element={
                      <DynamicRedirect unAuthPath="/login" authPath="/home" />
                    }
                  />

                    {/* Route which is accessed if no other route is matched */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>
              </CssBaseline>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
