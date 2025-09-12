export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: User;
  uploadedAt: string;
}

export interface HistoryRecord {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: User;
  changedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User;
  reporter: User;
  labels: string[];
  comments: Comment[];
  attachments: Attachment[];
  history: HistoryRecord[];
  estimatedTime?: number; // in hours
  timeSpent?: number; // in hours
  storyPoints?: number;
  relatedTickets: string[];
  watchers: User[];
}
                