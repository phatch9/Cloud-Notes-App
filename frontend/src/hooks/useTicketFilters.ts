import { useMemo } from 'react';
import type { Ticket } from '../types/ticket';
import type { FilterOptions, SortOptions } from '../types/filters';

export const useTicketFilters = (tickets: Ticket[], filters: FilterOptions, sort: SortOptions) => {
  return useMemo(() => {
    // Apply filters
    let filteredTickets = [...tickets];

    // Filter by status
    if (filters.status !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === filters.priority);
    }

    // Filter by assignee
    if (filters.assignee === 'me') {
      // In a real app, you'd get the current user ID from context/state
      const currentUserId = 'current-user-id'; // This should come from your auth context
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.assignee?.id === currentUserId
      );
    } else if (filters.assignee === 'unassigned') {
      filteredTickets = filteredTickets.filter(ticket => !ticket.assignee);
    }

    // Filter by due date
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    if (filters.dueDate === 'today') {
      filteredTickets = filteredTickets.filter(ticket => {
        if (!ticket.dueDate) return false;
        const dueDate = new Date(ticket.dueDate);
        return dueDate >= today && dueDate <= endOfDay;
      });
    } else if (filters.dueDate === 'week') {
      filteredTickets = filteredTickets.filter(ticket => {
        if (!ticket.dueDate) return false;
        const dueDate = new Date(ticket.dueDate);
        return dueDate >= today && dueDate <= endOfWeek;
      });
    } else if (filters.dueDate === 'overdue') {
      filteredTickets = filteredTickets.filter(ticket => {
        if (!ticket.dueDate) return false;
        const dueDate = new Date(ticket.dueDate);
        return dueDate < today;
      });
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredTickets = filteredTickets.filter(
        ticket =>
          ticket.title.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.id.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sortedTickets = [...filteredTickets].sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'dueDate':
          comparison = 
            (a.dueDate ? new Date(a.dueDate).getTime() : Infinity) - 
            (b.dueDate ? new Date(b.dueDate).getTime() : Infinity);
          break;
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
          break;
        }
        case 'status': {
          const statusOrder = { 'open': 1, 'in-progress': 2, 'resolved': 3, 'closed': 4 };
          comparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
          break;
        }
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return sortedTickets;
  }, [tickets, filters, sort]);
};
