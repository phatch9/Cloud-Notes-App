import React from 'react';
import type { Ticket } from '../types/ticket';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  Avatar, 
  AvatarGroup, 
  Tooltip,
  useMediaQuery
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import {
  Comment as CommentIcon,
  AttachFile as AttachmentIcon,
  WatchLater as DueDateIcon,
  Star as StoryPointsIcon,
} from '@mui/icons-material';

// Fallback for date-fns if not installed
const formatDistanceToNow = (date: Date | string) => {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const statusColors = {
  'open': '#4caf50',
  'in-progress': '#2196f3',
  'resolved': '#9c27b0',
  'closed': '#f44336'
} as const;

const priorityColors = {
  'low': '#4caf50',
  'medium': '#ff9800',
  'high': '#f44336'
} as const;

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger the onClick if the click wasn't on an interactive element
    if (!(e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) {
      onClick();
    }
  };

  return (
    <Card 
      onClick={handleClick}
      sx={{
        mb: 2,
        cursor: 'pointer',
        '&:hover': { boxShadow: 3 },
        transition: 'all 0.2s ease-in-out',
      }}
      elevation={0}
      variant="outlined"
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
            <Typography 
              variant="subtitle1" 
              component="div" 
              sx={{ 
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                mb: 0.5
              }}
            >
              {ticket.title}
            </Typography>
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mb={1.5}>
              <Chip 
                label={ticket.status.replace('-', ' ')}
                size="small"
                sx={{ 
                  backgroundColor: `${statusColors[ticket.status]}15`,
                  color: statusColors[ticket.status],
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
              <Chip
                label={ticket.priority}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: priorityColors[ticket.priority],
                  color: priorityColors[ticket.priority],
                  fontWeight: 'medium',
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
              {ticket.storyPoints && (
                <Chip
                  icon={<StoryPointsIcon fontSize="small" />}
                  label={ticket.storyPoints}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20 }}
                />
              )}
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center">
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontFamily: 'monospace',
                bgcolor: 'action.hover',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.7rem'
              }}
            >
              #{ticket.id.slice(0, 4)}
            </Typography>
          </Box>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            lineHeight: 1.4
          }}
        >
          {ticket.description}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            {ticket.assignee && (
              <Tooltip title={`Assigned to ${ticket.assignee.name}`}>
                <Avatar 
                  src={ticket.assignee.avatar} 
                  alt={ticket.assignee.name}
                  sx={{ width: 24, height: 24, fontSize: '0.8rem' }}
                >
                  {ticket.assignee.name.charAt(0)}
                </Avatar>
              </Tooltip>
            )}
            
            {ticket.watchers && ticket.watchers.length > 0 && (
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
                {ticket.watchers.map(watcher => (
                  <Tooltip key={watcher.id} title={watcher.name}>
                    <Avatar src={watcher.avatar} alt={watcher.name}>
                      {watcher.name.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            )}
            
            {ticket.comments && ticket.comments.length > 0 && (
              <Box display="flex" alignItems="center" ml={0.5}>
                <CommentIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {ticket.comments.length}
                </Typography>
              </Box>
            )}
            
            {ticket.attachments && ticket.attachments.length > 0 && (
              <Box display="flex" alignItems="center" ml={1}>
                <AttachmentIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {ticket.attachments.length}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            {ticket.dueDate && (
              <Tooltip 
                title={`Due ${formatDistanceToNow(new Date(ticket.dueDate).toISOString())}`}
              >
                <Box display="flex" alignItems="center">
                  <DueDateIcon 
                    fontSize="small" 
                    sx={{ 
                      color: new Date(ticket.dueDate) < new Date() ? 'error.main' : 'text.secondary',
                      fontSize: '1rem',
                      mr: 0.5
                    }} 
                  />
                  {!isSmallScreen && (
                    <Typography variant="caption" color="text.secondary">
                      {formatDistanceToNow(new Date(ticket.dueDate).toISOString())}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            )}
            
            {ticket.updatedAt && (
              <Tooltip title={`Updated ${formatDistanceToNow(new Date(ticket.updatedAt).toISOString())}`}>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {formatDistanceToNow(new Date(ticket.updatedAt).toISOString())}
                </Typography>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
