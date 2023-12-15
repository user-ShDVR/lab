import { Middleware, configureStore, isRejectedWithValue } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { clientsApi, employeesApi, pledgesApi, contractsApi } from "./api";
import { toast } from "react-toastify";

export const rtkQueryErrorLogger: Middleware =
  () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      console.warn('We got a rejected action!')
      console.warn(action.payload.data.error)
      const errorMessage = Array.isArray(action.payload.data.message)
        ? action.payload.data.message[0]
        : action.payload.data.message;

      console.warn(errorMessage);
      toast.error(errorMessage)
    }
    return next(action)
  }

export const store = configureStore({
  reducer: {
    [clientsApi.reducerPath]: clientsApi.reducer,
    [employeesApi.reducerPath]: employeesApi.reducer,
    [pledgesApi.reducerPath]: pledgesApi.reducer,
    [contractsApi.reducerPath]: contractsApi.reducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      rtkQueryErrorLogger,
      clientsApi.middleware,
      employeesApi.middleware,
      pledgesApi.middleware,
      contractsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
