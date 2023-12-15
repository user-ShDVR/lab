import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IPledge,
  ICreatePledgeRequest,
  ICreatePledgeResponse,
  IUpdatePledgeInfoInput,
} from "./types";

const BASE_URL = "http://localhost:3000";

export const pledgesApi = createApi({
  reducerPath: "pledgesApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
  }),

  endpoints: (builder) => ({
    createPledge: builder.mutation<ICreatePledgeResponse, ICreatePledgeRequest>(
      {
        query(data) {
          return {
            url: "credit",
            method: "POST",
            body: data,
          };
        },
      }
    ),

    getAllPledges: builder.query<IPledge[], void>({
      query: () => "credit",
    }),

    updatePledge: builder.mutation<
      IPledge,
      { credit_code: number; data: IUpdatePledgeInfoInput }
    >({
      query: ({ credit_code, data }) => ({
        url: `credit/${credit_code}`,
        method: "PATCH",
        body: { credit_code, ...data },
      }),
    }),

    deletePledge: builder.mutation<ICreatePledgeResponse, string>({
      query: (id) => ({
        url: `credit/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreatePledgeMutation,
  useUpdatePledgeMutation,
  useDeletePledgeMutation,
  useGetAllPledgesQuery,
} = pledgesApi;
