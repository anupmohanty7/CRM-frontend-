export interface Dashboard {
  totalCustomers: number;
  totalLeads: number;
  totalActualCustomers: number;

  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  lostLeads: number;

  pendingFollowUps: number;
  successfulFollowUps: number;
  failedFollowUps: number;
}