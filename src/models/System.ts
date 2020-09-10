export interface DbStat {
  total: number;
  state: null | string;
}

export class System {
  constructor(
    // just for testing Apollo federation
    public id: string,
    public message: string,
    public dbStats: DbStat[]
  ) {}
}
