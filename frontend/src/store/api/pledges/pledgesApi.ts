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
      { product_code: number; data: IUpdatePledgeInfoInput }
    >({
      query: ({ product_code, data }) => ({
        url: `credit/${product_code}`,
        method: "PATCH",
        body: { product_code, ...data },
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
