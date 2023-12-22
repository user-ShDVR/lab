import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IContract,
  ICreateContractRequest,
  ICreateContractResponse,
  IUpdateContractInfoInput,
} from "./types";

const BASE_URL = "http://localhost:3000";

export const contractsApi = createApi({
  reducerPath: "contractsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
  }),

  endpoints: (builder) => ({
    createContract: builder.mutation<
      ICreateContractResponse,
      ICreateContractRequest
    >({
      query(data) {
        return {
          url: "contracts",
          method: "POST",
          body: data,
        };
      },
    }),

    getAllContracts: builder.query<IContract[], {startDate: string, endDate: string}>({
      query: ({startDate, endDate}) => `contracts?startDate=${startDate}&endDate=${endDate}`,
    }),

    updateContract: builder.mutation<
      IContract,
      { contract_code: number; data: IUpdateContractInfoInput }
    >({
      query: ({ contract_code, data }) => ({
        url: `contracts/${contract_code}`,
        method: "PATCH",
        body: { contract_code, ...data },
      }),
    }),

    deleteContract: builder.mutation<ICreateContractResponse, string>({
      query: (id) => ({
        url: `contracts/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
  useGetAllContractsQuery,
} = contractsApi;
