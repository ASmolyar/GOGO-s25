import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import reportWebVitals from './reportWebVitals.ts';
import App from './App.tsx';
import { AlertProvider } from './util/context/AlertContext.tsx';
import { store, persistor } from './util/redux/store.ts';
import theme from './assets/theme.ts';
import { Population } from './ImpactReport/components';

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <BrowserRouter>
            <AlertProvider>
              <App />
            </AlertProvider>
          </BrowserRouter>
        </CssBaseline>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
