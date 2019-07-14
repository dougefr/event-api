export interface ITimelineResponse {
  products: Array<{
    name?: string;
    price?: number;
  }>;
  revenue?: number;
  store_name?: string;
  timestamp: string;
  transaction_id: string;
}
