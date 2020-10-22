export interface DbStat {
  total: number;
  state: null | string;
}

export interface HealthStats {
  message: string;
  dbStats: DbStat[];
}

export interface SystemDataSource {
  healthCheck(): Promise<HealthStats>;
}
