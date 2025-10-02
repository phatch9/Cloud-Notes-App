import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Paper,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

// Mock data
interface Note {
  id: number;
  title: string;
  content: string;
}

const recentNotes: Note[] = [
  { id: 1, title: 'Note 1', content: 'This is a note' },
  { id: 2, title: 'Note 2', content: 'This is another note' },
  { id: 3, title: 'Note 3', content: 'This is a third note' },
];

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Cloud Notes!
        </Typography>
      </Box>

      {/* Recent Notes */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {recentNotes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {note.title.charAt(0)}
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={note.title}
                subheader={note.content}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              {recentNotes.map((note) => (
                <ListItem key={`action-${note.id}`} disablePadding sx={{ mb: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {note.title.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={note.title}
                    secondary={note.content}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
