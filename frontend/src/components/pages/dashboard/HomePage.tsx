import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  CloudUpload as CloudUploadIcon,
  Devices as DevicesIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';

const features = [
  {
    icon: <SpeedIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Lightning Fast',
    description: 'Experience blazing fast performance with our optimized cloud infrastructure.'
  },
  {
    icon: <GroupIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Team Collaboration',
    description: 'Work seamlessly with your team in real-time on shared documents.'
  },
  {
    icon: <SecurityIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Enterprise Security',
    description: 'Your data is protected with bank-level encryption and compliance.'
  },
  {
    icon: <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Cloud Storage',
    description: 'Access your files from anywhere, anytime with our secure cloud storage.'
  },
  {
    icon: <DevicesIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Cross-Platform',
    description: 'Works on all your devices with our desktop and mobile applications.'
  },
  {
    icon: <BarChartIcon color="primary" sx={{ fontSize: 40 }} />,
    title: 'Analytics',
    description: 'Get insights with powerful analytics and reporting tools.'
  },
];


const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          pt: 15,
          pb: 10,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%)',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                component="h1" 
                gutterBottom
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                The Best Way to Organize Your Work
              </Typography>
              <Typography 
                variant="h6" 
                component="p" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  maxWidth: isMobile ? '100%' : '90%',
                }}
              >
                Streamline your workflow, collaborate with your team, and get more done with our powerful project management tools.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  component={RouterLink}
                  to={isAuthenticated ? '/dashboard' : '/register'}
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  component={RouterLink}
                  to="/features"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                component="img"
                src="/images/dashboard-preview.png"
                alt="Dashboard Preview"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: theme.shadows[10],
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" mb={8}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ fontWeight: 700 }}
          >
            Everything You Need to Succeed
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Our platform provides all the tools you need to manage projects, collaborate with your team, and achieve your goals.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid key={index} xs={12} sm={6} md={4} lg={3}>
              <Card
                variant="outlined"
                sx={{ 
                  height: '100%',
                  p: 3,
                  textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <Box mb={2}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 10,
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ fontWeight: 700, mb: 3 }}
          >
            Ready to get started?
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}
          >
            Join thousands of teams who are already using our platform to be more productive.
          </Typography>
          <Button
            component={RouterLink}
            to={isAuthenticated ? '/dashboard' : '/register'}
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Start Your Free Trial
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer" 
        sx={{
          bgcolor: 'background.paper',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" component="h3" gutterBottom>
                Cloud Notes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The best way to organize your work and collaborate with your team.
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" component="h4" gutterBottom>
                Product
              </Typography>
              <List dense>
                {['Features', 'Pricing', 'Integrations', 'Updates', 'Roadmap'].map((item) => (
                  <ListItem key={item} disableGutters sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={
                        <Typography 
                          component="a" 
                          href="#" 
                          color="text.secondary" 
                          variant="body2"
                          sx={{
                            textDecoration: 'none',
                            '&:hover': {
                              color: 'primary.main',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {item}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" component="h4" gutterBottom>
                Company
              </Typography>
              <List dense>
                {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                  <ListItem key={item} disableGutters sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography
                          component="a"
                          href="#"
                          color="text.secondary"
                          variant="body2"
                          sx={{
                            textDecoration: 'none',
                            '&:hover': {
                              color: 'primary.main',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {item}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" component="h4" gutterBottom>
                Resources
              </Typography>
              <List dense>
                {['Help Center', 'Documentation', 'API Reference', 'Community', 'Status'].map((item) => (
                  <ListItem key={item} disableGutters sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={
                        <Typography
                          component="a"
                          href="#"
                          color="text.secondary"
                          variant="body2"
                          sx={{
                            textDecoration: 'none',
                            '&:hover': {
                              color: 'primary.main',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {item}
                        </Typography>
                      } 
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="subtitle2" component="h4" gutterBottom>
                Legal
              </Typography>
              <List dense>
                {['Privacy', 'Terms', 'Security', 'GDPR', 'Compliance'].map((item) => (
                  <ListItem key={item} disableGutters sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={
                        <Typography 
                          component="a" 
                          href="#" 
                          color="text.secondary" 
                          variant="body2"
                          sx={{
                            textDecoration: 'none',
                            '&:hover': {
                              color: 'primary.main',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {item}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Cloud Notes. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
              {['Twitter', 'Facebook', 'LinkedIn', 'GitHub'].map((network) => (
                <Typography
                  key={network}
                  component="a"
                  href="#"
                  color="text.secondary"
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {network}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
