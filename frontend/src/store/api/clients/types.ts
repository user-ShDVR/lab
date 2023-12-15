export interface IClient {
  key: string;
  client_code: number;
  surname: string;
  name: string;
  lastname: string;
  workplace: string;
  birthday: Date;
  salary: string;
  address: string;
  phone_number: string;
  passport_data: string;
}

export interface ICreateClientRequest {
  full_name: string;
  address: string;
  phone_number: string;
  passport_data: string;
}

export interface ICreateClientResponse {
  message: string;
  client: IClient;
}

export interface IUpdateClientInfoInput {
  full_name?: string;
  address?: string;
  phone_number?: string;
  passport_data?: string;
}

export interface IUpdateClientResponse {
  message: string;
  client?: IClient;
}

export interface IDeleteClientResponse {
  message: string;
}
