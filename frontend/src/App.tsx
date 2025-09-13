import { useState, useEffect } from 'react';
import type { Ticket, TicketStatus, TicketPriority, User } from './types/ticket';
import { TicketList } from './components/TicketList';
import { TicketForm } from './components/TicketForm';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

// Mock users
const mockUsers: User[] = [
  { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
];

// Data for initial state
const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Fix login page layout issues',
    description: 'The login form is not properly aligned on mobile devices and needs to be fixed.',
    status: 'open' as TicketStatus,
    priority: 'high' as TicketPriority,
    dueDate: new Date('2023-10-25T23:59:59').toISOString(),
    createdAt: new Date('2023-10-15T10:30:00').toISOString(),
    updatedAt: new Date('2023-10-15T10:30:00').toISOString(),
    reporter: mockUsers[0],
    assignee: mockUsers[1],
    labels: ['frontend', 'bug', 'responsive'],
    comments: [
      {
        id: 'c1',
        content: 'I noticed this issue on iPhone 12. The form fields are overlapping.',
        author: mockUsers[0],
        createdAt: new Date('2023-10-15T10:30:00').toISOString(),
        updatedAt: new Date('2023-10-15T10:30:00').toISOString(),
      }
    ],
    attachments: [],
    history: [
      {
        id: 'h1',
        field: 'status',
        oldValue: '',
        newValue: 'open',
        changedBy: mockUsers[0],
        changedAt: new Date('2023-10-15T10:30:00').toISOString(),
      }
    ],
    estimatedTime: 4,
    timeSpent: 1.5,
    storyPoints: 3,
    relatedTickets: ['2'],
    watchers: [mockUsers[0], mockUsers[1]],
  },
  {
    id: '2',
    title: 'Implement user profile page',
    description: 'Create a new page where users can view and edit their profile information.',
    status: 'in-progress' as TicketStatus,
    priority: 'medium' as TicketPriority,
    dueDate: new Date('2023-10-30T23:59:59').toISOString(),
    createdAt: new Date('2023-10-14T14:15:00').toISOString(),
    updatedAt: new Date('2023-10-14T16:45:00').toISOString(),
    reporter: mockUsers[1],
    assignee: mockUsers[2],
    labels: ['frontend', 'feature', 'profile'],
    comments: [],
    attachments: [],
    history: [
      {
        id: 'h2',
        field: 'status',
        oldValue: 'open',
        newValue: 'in-progress',
        changedBy: mockUsers[2],
        changedAt: new Date('2023-10-14T16:45:00').toISOString(),
      }
    ],
    estimatedTime: 8,
    timeSpent: 2,
    storyPoints: 5,
    relatedTickets: ['1', '3'],
    watchers: [mockUsers[1], mockUsers[2]],
  },
  {
    id: '3',
    title: 'Add input validation to contact form',
    description: 'The contact form should validate email format and required fields before submission.',
    status: 'open' as TicketStatus,
    priority: 'low' as TicketPriority,
    dueDate: new Date('2023-11-05T23:59:59').toISOString(),
    createdAt: new Date('2023-10-13T09:20:00').toISOString(),
    updatedAt: new Date('2023-10-13T09:20:00').toISOString(),
    reporter: mockUsers[2],
    labels: ['frontend', 'validation', 'forms'],
    comments: [],
    attachments: [],
    history: [
      {
        id: 'h3',
        field: 'status',
        oldValue: '',
        newValue: 'open',
        changedBy: mockUsers[2],
        changedAt: new Date('2023-10-13T09:20:00').toISOString(),
      }
    ],
    estimatedTime: 3,
    storyPoints: 2,
    relatedTickets: ['2'],
    watchers: [mockUsers[2]],
  },
];

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>(undefined);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Load tickets on initial render
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // In production, this would be an API call
        // const response = await fetch('/api/tickets');
        // const data = await response.json();
        // setTickets(data);
        
        // For now, use mock data as sample
        setTimeout(() => {
          setTickets(mockTickets);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load tickets. Please try again later.');
        setLoading(false);
        console.error('Error fetching tickets:', err);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateTicket = () => {
    setSelectedTicket(undefined);
    setIsFormOpen(true);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsFormOpen(true);
  };

  const handleSubmitTicket = async (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      
      if (selectedTicket) {
        // Update existing ticket
        const updatedTicket: Ticket = {
          ...selectedTicket,
          ...ticketData,
          updatedAt: now,
        };
        
        // In a real app, this would be an API call
        // await fetch(`/api/tickets/${selectedTicket.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(updatedTicket),
        // });
        
        setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        showSnackbar('Ticket updated successfully!', 'success');
      } else {
        // Create new ticket
        const newTicket: Ticket = {
          ...ticketData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: now,
          updatedAt: now,
        };
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/tickets', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(newTicket),
        // });
        // const createdTicket = await response.json();
        
        setTickets([newTicket, ...tickets]);
        showSnackbar('Ticket created successfully!', 'success');
      }
      
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error saving ticket:', err);
      showSnackbar('Failed to save ticket. Please try again.', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Ticket Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
          <Container maxWidth="lg">
            <TicketList 
              tickets={tickets} 
              onTicketClick={handleEditTicket}
              onCreateNew={handleCreateTicket}
            />
          </Container>
        </Box>
        
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Ticket Tracker. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
      
      <TicketForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitTicket}
        initialData={selectedTicket}
        title={selectedTicket ? 'Edit Ticket' : 'Create New Ticket'}
      />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
