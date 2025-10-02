import { Box, Button, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: isMobile ? 2 : 4,
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        boxSizing: 'border-box'
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{
          textAlign: 'center',
          py: 8,
          px: isMobile ? 2 : 4,
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Typography 
          variant={isMobile ? 'h3' : 'h2'} 
          component="h1" 
          gutterBottom 
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 2
          }}
        >
          Welcome to Cloud Notes App
        </Typography>
        <Typography 
          variant={isMobile ? 'body1' : 'h5'} 
          color="text.secondary" 
          paragraph
          sx={{
            mb: 4,
            fontSize: isMobile ? '1.1rem' : '1.5rem',
            lineHeight: 1.5
          }}
        >
          A simple and secure way to manage your notes in the cloud
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center', 
            gap: 2, 
            mt: 4,
            width: '100%',
            '& .MuiButton-root': {
              minWidth: isMobile ? '100%' : 180,
              py: 1.5,
              fontSize: isMobile ? '1rem' : '1.1rem'
            }
          }}
        >
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            size="large"
            fullWidth={isMobile}
          >
            Login
          </Button>
          <Button 
            component={Link} 
            to="/register" 
            variant="outlined" 
            size="large"
            fullWidth={isMobile}
            sx={{
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2
              }
            }}
          >
            Register
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
