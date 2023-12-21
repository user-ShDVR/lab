import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IEmployee,
  ICreateEmployeeRequest,
  ICreateEmployeeResponse,
  IUpdateEmployeeInfoInput,
} from "./types";

const BASE_URL = "http://localhost:3000";

export const employeesApi = createApi({
  reducerPath: "employeesApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
  }),

  endpoints: (builder) => ({
    createEmployee: builder.mutation<
      ICreateEmployeeResponse,
      ICreateEmployeeRequest
    >({
      query(data) {
        return {
          url: "employees",
          method: "POST",
          body: data,
        };
      },
    }),

    getAllEmployees: builder.query<IEmployee[], void>({
      query: () => "employees",
    }),

    updateEmployee: builder.mutation<
      IEmployee,
      { seller_code: number; data: IUpdateEmployeeInfoInput }
    >({
      query: ({ seller_code, data }) => ({
        url: `employees/${seller_code}`,
        method: "PATCH",
        body: { seller_code, ...data },
      }),
    }),

    deleteEmployee: builder.mutation<ICreateEmployeeResponse, string>({
      query: (id) => ({
        url: `employees/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetAllEmployeesQuery,
} = employeesApi;
