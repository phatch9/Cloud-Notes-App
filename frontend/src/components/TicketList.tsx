import React, { useState } from 'react';
import type { Ticket } from '../types/ticket';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { TicketCard } from './TicketCard';
import { TicketFilters } from './TicketFilters';
import { useTicketFilters } from '../hooks/useTicketFilters';
import { DEFAULT_FILTERS, DEFAULT_SORT } from '../types/filters';
import type { FilterOptions, SortOptions } from '../types/filters';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  onCreateNew: () => void;
  currentUser: { id: string; name: string } | null;
  loading?: boolean;
}

export const TicketList: React.FC<TicketListProps> = ({ 
  tickets, 
  onTicketClick, 
  onCreateNew,
  currentUser,
  loading = false
}) => {
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOptions>(DEFAULT_SORT);
  
  const filteredAndSortedTickets = useTicketFilters(tickets, filters, sort);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSort: SortOptions) => {
    setSort(newSort);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Typography variant="h5" component="h1">
          Tickets ({filteredAndSortedTickets.length})
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onCreateNew}
          disabled={loading}
          sx={{ whiteSpace: 'nowrap' }}
        >
          New Ticket
        </Button>
      </Box>

      <TicketFilters 
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        currentUser={currentUser}
        loading={loading}
      />

      {filteredAndSortedTickets.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="200px"
          textAlign="center"
          p={3}
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No tickets found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      ) : (
        <Box>
          {filteredAndSortedTickets.map(ticket => (
            <Box key={ticket.id} mb={2}>
              <TicketCard 
                ticket={ticket} 
                onClick={() => onTicketClick(ticket)} 
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
