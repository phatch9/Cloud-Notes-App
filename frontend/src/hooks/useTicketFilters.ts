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

