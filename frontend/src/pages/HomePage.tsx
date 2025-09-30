import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Welcome to Cloud Notes App
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          A simple and secure way to manage your notes in the cloud
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button component={Link} to="/login" variant="contained" size="large">
            Login
          </Button>
          <Button component={Link} to="/register" variant="outlined" size="large">
            Register
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
