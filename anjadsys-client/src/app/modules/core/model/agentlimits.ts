export interface NewAgentLimits{
  debit: number;
  agentID: string;
}

export interface AgentLimitsAPI {
  id: string;
  debit: number;
  credit: string;
  service?: {
    serviceID: string;
    userID: string;
    cost: number;
    customerServiceID: string
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentLimitsArrayAPI{
  data: [AgentLimitsAPI]
}

export interface SearchAgentLimits {
  agentID: string;
  main: boolean;
}
