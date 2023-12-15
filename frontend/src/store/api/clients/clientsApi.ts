import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IClient,
  ICreateClientRequest,
  ICreateClientResponse,
  IUpdateClientInfoInput,
} from "./types";

const BASE_URL = "http://localhost:3000";

export const clientsApi = createApi({
  reducerPath: "clientsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
  }),

  endpoints: (builder) => ({
    createClient: builder.mutation<ICreateClientResponse, ICreateClientRequest>(
      {
        query(data) {
          return {
            url: "clients",
            method: "POST",
            body: data,
          };
        },
      }
    ),

    getAllClients: builder.query<IClient[], void>({
      query: () => "clients",
    }),

    updateClient: builder.mutation<
      IClient,
      { client_code: number; data: IUpdateClientInfoInput }
    >({
      query: ({ client_code, data }) => ({
        url: `clients/${client_code}`,
        method: "PATCH",
        body: { client_code, ...data },
      }),
    }),

    deleteClient: builder.mutation<ICreateClientResponse, string>({
      query: (id) => ({
        url: `clients/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetAllClientsQuery,
} = clientsApi;
