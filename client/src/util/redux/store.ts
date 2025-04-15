import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducers from './reducers';

/**
 * Persist config and persisted reducer are configuration that is required for redux-persist to work. This allows for redux state to be persisted in local storage so that redux state is not lost when the page is refreshed.
 */
const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers(reducers);

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  // Simplified middleware configuration that disables serializable check entirely
  // This is not recommended for production, but will help debug the current issue
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export { store, persistor };
