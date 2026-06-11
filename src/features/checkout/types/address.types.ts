export interface IAddress {
  id: number;
  usuario_id: number;
  alias: string | null;
  linea1: string;
  linea2: string | null;
  ciudad: string;
  provincia: string;
  codigo_postal: string | null;
  es_principal: boolean;
}

export interface AddressListResponse {
  data: IAddress[];
  total: number;
}

export type AddressPayload = {
  alias: string;
  linea1: string;
  linea2: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  es_principal: boolean;
};
