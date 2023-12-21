export interface IPledge {
  key: string;
  product_code: number;
  product_name: string;
  price: string;
  quanity: any;
}

export interface ICreatePledgeRequest {
  product_name: string;
  price: string;
  quanity: number;
}

export interface ICreatePledgeResponse {
  message: string;
  pledge: any;
}

export interface IUpdatePledgeInfoInput {
  product_name: string;
  price: string;
  quanity: any;
}

export interface IUpdatePledgeResponse {
  message: string;
  pledge?: IPledge;
}

export interface IDeletePledgeResponse {
  message: string;
}
