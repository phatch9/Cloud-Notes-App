import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  ListItemAvatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Grid } from '@mui/material/Unstable_Grid2';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

// Mock data - replace with actual API calls
const recentActivities = [
  { id: 1, user: 'John Doe', action: 'created a new ticket', time: '2 hours ago', type: 'create' },
  { id: 2, user: 'Jane Smith', action: 'commented on ticket #123', time: '4 hours ago', type: 'comment' },
  { id: 3, user: 'Mike Johnson', action: 'updated status of ticket #120', time: '1 day ago', type: 'update' },
  { id: 4, user: 'Sarah Williams', action: 'assigned ticket #118 to you', time: '2 days ago', type: 'assign' },
];

const DashboardPage = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateNew = (type: 'ticket' | 'project') => {
    handleClose();
    if (type === 'ticket') {
      navigate('/tickets/new');
    } else {
      navigate('/projects/new');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleClick}
            aria-controls={open ? 'create-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            Create New
          </Button>
          <Menu
            id="create-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'create-button',
            }}
          >
            <MenuItem onClick={() => handleCreateNew('ticket')}>
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Ticket</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleCreateNew('project')}>
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Project</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Open Tickets
                  </Typography>
                  <Typography variant="h4">12</Typography>
                </div>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AssignmentIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    In Progress
                  </Typography>
                  <Typography variant="h4">5</Typography>
                </div>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <AccessTimeIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Resolved
                  </Typography>
                  <Typography variant="h4">24</Typography>
                </div>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Overdue
                  </Typography>
                  <Typography variant="h4">3</Typography>
                </div>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <ErrorIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tickets */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Recent Tickets"
              action={
                <Button color="primary" onClick={() => navigate('/tickets')}>
                  View All
                </Button>
              }
            />
            <CardContent>
              <List>
                {[1, 2, 3, 4, 5].map((ticket) => (
                  <div key={ticket}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" aria-label="more">
                          <MoreVertIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <AssignmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`Ticket #${100 + ticket} - This is a sample ticket title`}
                        secondary={`Updated 2 days ago • Status: Open`}
                      />
                    </ListItem>
                    {ticket < 5 && <Divider variant="inset" component="li" />}
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Recent Activity" />
            <CardContent>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {recentActivities.map((activity, index) => (
                  <div key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={activity.user} src="/static/images/avatar/1.jpg" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.user}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {activity.action}
                            </Typography>
                            {` — ${activity.time}`}
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
