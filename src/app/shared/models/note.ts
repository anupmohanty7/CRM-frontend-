export interface Note {
  id?: number;
  content: string;
  customer: {
    id: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    company?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}