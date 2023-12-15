export interface IEmployee {
  surname: string;
  lastname: string;
  name: string;
  key: string;
  employee_code: number;
  full_name: string;
  phone_number: string;
  position: string;
}

export interface ICreateEmployeeRequest {
  full_name: string;
  phone_number: string;
  birth_date: Date;
  position: string;
  address: string;
}

export interface ICreateEmployeeResponse {
  message: string;
  employee: IEmployee;
}

export interface IUpdateEmployeeInfoInput {
  full_name?: string;
  phone_number?: string;
  birth_date?: Date;
  position?: string;
  address?: string;
}

export interface IUpdateEmployeeResponse {
  message: string;
  employee?: IEmployee;
}

export interface IDeleteEmployeeResponse {
  message: string;
}
