import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import { Box } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <Box sx={{ width: "100%", height: "100%", background: "linear-gradient(to right, #fff5f2, #ffe4dc)" }}>
      <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute component={<Dashboard />} />}
          />
        </Routes>
      </Router>
      <Toaster />
    </Box>
  );
}

export default App;
