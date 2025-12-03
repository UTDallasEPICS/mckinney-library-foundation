export interface Grant {
  id: string;
  boardMemberId?: string;
  boardMember?: {
    id: string;
    name: string;
  };
  grantorId?: string;
  grantor?: {
    id: string;
    name: string;
  };
  purpose?: string;
  method?: string;
  monetaryAmount?: string;
  nonMonetaryAmount?: string;
  status?: number;
  notes?: string;
  proposedDate: string;
  receivedDate?: string;
  startDate: string;
  endDate: string;
  lastEditDate: string;
}
