import React, { useState, useEffect } from 'react';
import type { Ticket, TicketStatus, TicketPriority, User } from '../types/ticket';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  IconButton,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { Close, Label } from '@mui/icons-material';

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const priorityOptions: { value: TicketPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

// Replace this with actual user list (API or props)
const users: User[] = [
  { id: 'u1', name: 'Current User', email: 'current@example.com' },
  { id: 'u2', name: 'Jane Doe', email: 'jane@example.com' },
  { id: 'u3', name: 'John Smith', email: 'john@example.com' },
];

interface TicketFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Ticket>;
  title?: string;
  currentUser: User; // 👈 required
}

export const TicketForm: React.FC<TicketFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = 'Create New Ticket',
  currentUser,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    reporter: currentUser, // fixed: must be User
    assignee: undefined,   // fixed: optional User
    labels: [],
    comments: [],
    attachments: [],
    history: [],
    relatedTickets: [],
    watchers: [],
  });
  
  const [newLabel, setNewLabel] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        status: initialData.status || 'open',
        priority: initialData.priority || 'medium',
        labels: initialData.labels || [],
        reporter: initialData.reporter || currentUser,
        comments: initialData.comments || [],
        attachments: initialData.attachments || [],
        history: initialData.history || [],
        relatedTickets: initialData.relatedTickets || [],
        watchers: initialData.watchers || [],
      }));
    } else if (!open) {
      setFormData({
        title: '',
        description: '',
        status: 'open',
        priority: 'medium',
        reporter: currentUser,
        assignee: undefined,
        labels: [],
        comments: [],
        attachments: [],
        history: [],
        relatedTickets: [],
        watchers: [],
      });
      setNewLabel('');
      setErrors({});
    }
  }, [open, initialData, currentUser]);

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!name) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddLabel = () => {
    if (newLabel.trim() && !formData.labels?.includes(newLabel.trim())) {
      setFormData(prev => ({
        ...prev,
        labels: [...(prev.labels || []), newLabel.trim()],
      }));
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels?.filter(label => label !== labelToRemove) || [],
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ pt: 3, '& > :not(style)': { mb: 2 } }}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          required
          autoFocus
        />
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          required
        />
        
        <Box display="flex" gap={2} flexWrap="wrap">
          <FormControl fullWidth size="small" sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {statusOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth size="small" sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {priorityOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* Assignee select */}
        <FormControl fullWidth size="small">
          <InputLabel id="assignee-label">Assignee</InputLabel>
          <Select
            labelId="assignee-label"
            name="assignee"
            value={formData.assignee?.id || ''}
            onChange={(e) => {
              const user = users.find(u => u.id === e.target.value);
              setFormData(prev => ({ ...prev, assignee: user }));
            }}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {users.map(u => (
              <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Labels */}
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Label color="action" fontSize="small" />
            <Typography variant="body2" color="textSecondary">Labels</Typography>
          </Box>
          
          <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
            {formData.labels?.map(label => (
              <Chip
                key={label}
                label={label}
                size="small"
                onDelete={() => handleRemoveLabel(label)}
              />
            ))}
          </Box>
          
          <Box display="flex" gap={1}>
            <TextField
              size="small"
              placeholder="Add label..."
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLabel();
                }
              }}
              fullWidth
            />
            <Button 
              variant="outlined" 
              size="small"
              onClick={handleAddLabel}
              disabled={!newLabel.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {initialData?.id ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
