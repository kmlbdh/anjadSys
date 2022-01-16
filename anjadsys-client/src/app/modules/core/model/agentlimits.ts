export interface NewAgentLimits{
  limitAmount: number;
  agentID: string;
}

export interface AgentLimitsAPI {
  _id: string;
  totalMoney: number;
  agentID: string;
  service?: {
    serviceID: string;
    userID: string;
    cost: number;
    customerServiceID: string
  };
  created_at: Date;
  updated_at: Date;
}

export interface AgentLimitsArrayAPI{
  data: [AgentLimitsAPI]
}

export interface SearchAgentLimits {
  agentID: string;
  main: boolean;
}
