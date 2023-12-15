export interface IPledge {
  key: string;
  credit_code: number;
  credit_name: string;
  min_amount: number;
  max_amount: number;
  min_credit_term: number;
  max_credit_term: number;
  interest_rate: number;
}

export interface ICreatePledgeRequest {
  credit_name: string;
  min_amount: number;
  max_amount: number;
  min_credit_term: number;
  max_credit_term: number;
  interest_rate: number;
}

export interface ICreatePledgeResponse {
  message: string;
  pledge: IPledge;
}

export interface IUpdatePledgeInfoInput {
  credit_name: string;
  min_amount: number;
  max_amount: number;
  min_credit_term: number;
  max_credit_term: number;
  interest_rate: number;
}

export interface IUpdatePledgeResponse {
  message: string;
  pledge?: IPledge;
}

export interface IDeletePledgeResponse {
  message: string;
}
