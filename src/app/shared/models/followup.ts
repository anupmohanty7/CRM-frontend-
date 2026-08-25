export interface FollowUp {
  id?: number;

  customer: {
    id: number;
    firstname: string;
    lastname: string;
    email?: string;
  };

  followUpDateTime: string;

  status: 'PENDING' | 'SUCCESS_CLOSED' | 'FAILED_CLOSED';

  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}