import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';

// Mock data - replace with actual API calls
const recentActivities = [
  { id: 1, user: 'John Doe', action: 'created', item: 'Project X', time: '2 hours ago' },
  { id: 2, user: 'Jane Smith', action: 'updated', item: 'Document Y', time: '5 hours ago' },
  { id: 3, user: 'Mike Johnson', action: 'commented on', item: 'Task Z', time: '1 day ago' },
  { id: 4, user: 'Sarah Williams', action: 'assigned you to', item: 'Bug #123', time: '2 days ago' },
];

const stats = [
  { title: 'Total Projects', value: '24', change: '+12%', trend: 'up' },
  { title: 'Active Tasks', value: '15', change: '+5', trend: 'up' },
  { title: 'Completed', value: '89', change: '+8%', trend: 'up' },
  { title: 'Overdue', value: '3', change: '-2', trend: 'down' },
];

const projects = [
  {
    id: 1,
    name: 'Website Redesign',
    progress: 75,
    status: 'In Progress',
    team: ['JD', 'JS', 'MJ'],
    deadline: '2023-12-15'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    progress: 30,
    status: 'In Progress',
    team: ['MJ', 'SW'],
    deadline: '2024-02-20'
  },
  { 
    id: 3,
    name: 'Marketing Campaign',
    progress: 10,
    status: 'Planning',
    team: ['JS', 'SW'],
    deadline: '2024-01-10'
  },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);

  // In a real app, you would fetch this data from an API
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
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's what's happening with your projects today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h4" component="div">
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: stat.trend === 'up' ? 'success.main' : 'error.main',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {stat.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Projects */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2">Active Projects</Typography>
              <IconButton color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {projects.map((project) => (
                <Card key={project.id} variant="outlined" sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {project.name.charAt(0)}
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={project.name}
                    subheader={`Due: ${project.deadline} • ${project.status}`}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={project.progress} 
                          color={
                            project.progress < 30 ? 'error' : 
                            project.progress < 70 ? 'warning' : 'success'
                          }
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {project.progress}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex' }}>
                        {project.team.map((member, i) => (
                          <Avatar 
                            key={i} 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              fontSize: '0.75rem',
                              ml: i > 0 ? -1 : 0,
                              border: '2px solid white',
                              bgcolor: 'primary.main',
                            }}
                          >
                            {member}
                          </Avatar>
                        ))}
                      </Box>
                      <Box>
                        {project.status === 'Completed' ? (
                          <CheckCircleIcon color="success" />
                        ) : project.status === 'In Progress' ? (
                          <PendingIcon color="warning" />
                        ) : (
                          <ErrorIcon color="action" />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Recent Activity
            </Typography>
            <List sx={{ width: '100%' }}>
              {recentActivities.map((activity, index) => (
                <ListItem key={activity.id} disableGutters disablePadding>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 40, height: 40, mr: 1 }}>
                      {activity.user.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        <strong>{activity.user}</strong> {activity.action} <strong>{activity.item}</strong>
                      </Typography>
                    }
                    secondary={activity.time}
                    secondaryTypographyProps={{ variant: 'caption' }}
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
