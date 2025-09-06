import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Ticket, TicketStatus, TicketPriority } from '../types/ticket';

const statusColors = {
  'open': '#4caf50',
  'in-progress': '#2196f3',
  'resolved': '#9c27b0',
  'closed': '#f44336'
};

const priorityColors = {
  'low': '#4caf50',
  'medium': '#ff9800',
  'high': '#f44336'
};

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <Card 
      onClick={onClick}
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        '&:hover': { boxShadow: 3 }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div">
            {ticket.title}
          </Typography>
          <Chip 
            label={ticket.status}
            size="small"
            sx={{ 
              backgroundColor: `${statusColors[ticket.status]}22`,
              color: statusColors[ticket.status],
              fontWeight: 'bold'
            }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }} noWrap>
          {ticket.description}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip 
            label={`Priority: ${ticket.priority}`}
            size="small"
            variant="outlined"
            sx={{ 
              borderColor: priorityColors[ticket.priority],
              color: priorityColors[ticket.priority]
            }}
          />
          <Typography variant="caption" color="text.secondary">
            #{ticket.id.slice(0, 6)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
