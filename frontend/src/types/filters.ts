import type { TicketStatus, TicketPriority } from './ticket';

export interface FilterOptions {
  status: TicketStatus | 'all';
  priority: TicketPriority | 'all';
  assignee: string | 'all' | 'me' | 'unassigned';
  dueDate: 'today' | 'week' | 'overdue' | 'all';
  searchQuery: string;
}

export interface SortOptions {
  field: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'status';
  direction: 'asc' | 'desc';
}

export const DEFAULT_FILTERS: FilterOptions = {
  status: 'all',
  priority: 'all',
  assignee: 'all',
  dueDate: 'all',
  searchQuery: '',
};

export const DEFAULT_SORT: SortOptions = {
  field: 'updatedAt',
  direction: 'desc',
};
