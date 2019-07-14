export interface IDitoQuestionsEvent {
  event: "comprou" | "comprou-produto";
  timestamp: string;
  revenue?: number;
  custom_data: Array<{
    key: string;
    value: number | string;
  }>;
}
