import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session'; 
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import userReducer from '@/redux/slice/userSlice';
import categoryReducer from '@/redux/slice/categoriesSlice';
import businessesReducer from '@/redux/slice/bussinessSlice';
import searchReducer from '@/redux/slice/searchSlice';

const persistConfig = {
  key: 'root',
  storage: storageSession,
};

const rootReducer = combineReducers({
    user: userReducer,
    categories: categoryReducer,
    businesses: businessesReducer,
    search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store= configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
