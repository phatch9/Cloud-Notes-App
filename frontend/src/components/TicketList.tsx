import React, { useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { Ticket, TicketStatus, TicketPriority } from '../types/ticket';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  FormControl,
  Select,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add, Search, FilterList, Sort } from '@mui/icons-material';
import { TicketCard } from './TicketCard';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  onCreateNew: () => void;
}

export const TicketList: React.FC<TicketListProps> = ({ 
  tickets, 
  onTicketClick, 
  onCreateNew 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
  });

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        flexDirection={isMobile ? 'column' : 'row'}
        gap={2}
      >
        <Typography variant="h4" component="h1">
          Tickets
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={onCreateNew}
          fullWidth={isMobile}
        >
          New Ticket
        </Button>
      </Box>

      <Box 
        display="flex" 
        gap={2} 
        mb={3}
        flexDirection={isMobile ? 'column' : 'row'}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleFilterClick}
            sx={{ minWidth: '120px' }}
          >
            Filters
          </Button>
          
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'priority')}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <Sort />
                </InputAdornment>
              }
              sx={{ height: '100%' }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" gutterBottom>
            Status
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <Select
              value={statusFilter}
              onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value as TicketStatus | 'all')}
              displayEmpty
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle2" gutterBottom>
            Priority
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={priorityFilter}
              onChange={(e: SelectChangeEvent) => setPriorityFilter(e.target.value as TicketPriority | 'all')}
              displayEmpty
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Menu>

      {sortedTickets.length === 0 ? (
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
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first ticket to get started'}
          </Typography>
        </Box>
      ) : (
        <Box>
          {sortedTickets.map(ticket => (
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
