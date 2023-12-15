export interface IContract {
  key: string;
  contract_code: number;
  contract_term: number;
  contract_amount: number;
  client_code: number;
  credit_code: number;
  employee_code: number;
}

export interface ICreateContractRequest {
  contract_amount: number;
  contract_term: number;
  client_code: number;
  pledge_code: number;
  employee_code: number;
}

export interface ICreateContractResponse {
  message: string;
  client: IContract;
}

export interface IUpdateContractInfoInput {
  creation_date?: Date;
  termination_date?: Date;
  payment_date?: Date;
  contract_type?: string;
  payment_to_client?: string;
  client_code?: number;
  pledge_code?: number;
  employee_code?: number;
}

export interface IUpdateContractResponse {
  message: string;
  contract?: IContract;
}

export interface IDeleteContractResponse {
  message: string;
}
