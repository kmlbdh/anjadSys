import { UserAPI } from './user';
export interface NewAgentLimits{
  debit: number;
  agentID: string;
}

export interface AgentLimitsAPI {
  id: string;
  debit: number;
  credit: string;
  Agent?: UserAPI;
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
  data: [AgentLimitsAPI];
  total: number;
}

export interface SearchAgentLimits {
  accountId?: number;
  agentID?: string;
  main?: boolean;
  skip?: number;
  limit?: number;
}
