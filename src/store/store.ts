import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import dataReducer from './reducers/'
import dataSliceReducer from '../redux/slice/dataSlice';

const store = configureStore({
  // reducer: rootReducer,
  reducer: {
    data: dataSliceReducer
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch