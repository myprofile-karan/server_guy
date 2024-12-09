import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Avatar, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setQuery, setPage } from '../redux/slices/searchSlice';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Logo from "../../public/logo.png";
import Algolia from "../../public/algolia.png";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { clear } from '../redux/slices/authSlice';
import { toast } from 'react-hot-toast';

const Header: React.FC<{ query: string }> = ({ query }) => {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(query)

  useEffect(() => {

    setInput(query);
  }, [location.search]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSearch = (value: string) => {
    setInput(value);
    dispatch(setQuery(value));
    dispatch(setPage(0)); // Reset to the first page
    navigate(`?query=${value}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(clear());
    navigate('/login');
    toast.success("Logged out successfully");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: "10px", py: "15px", background: "#FF742B", gap: "10px" }}>
      <Box sx={{
        width: {
          xs: "25%",
          md: "18%"
        },
        display: "flex", alignItems: "center", gap: "10px"
      }}>
        <Avatar src={Logo} variant='square' sx={{ width: 60, height: 60 }} />
        <Typography sx={{ fontSize: "24px", fontWeight: "500" }}>{user.username}</Typography>
      </Box>
      <Box sx={{
        width: {
          xs: "55%",
          md: "85%",
        }
      }}>
        <TextField
          value={input}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search stories by title, url or author"
          InputProps={{
            startAdornment: (
              <SearchOutlinedIcon sx={{ color: '#FF742B', mr: 1 }} />
            ),
            endAdornment: (
              <Avatar src={Algolia} sx={{
                width: {
                  xs: "100px",
                  md: "200px"
                },
                height: {
                  xs:25,
                  md:35
                }
              }} />
            ),
          }}
          sx={{
            width: {
              xs: "90%",
              md: "90%",
            },
            padding: 0,
            backgroundColor: 'white',
            '& .MuiInputBase-root': {
              height: {
                xs: 40,
                md: 55
              },
              backgroundColor: 'white',
              borderRadius: 1,
            },
          }}
        />
      </Box>

      <IconButton onClick={handleLogout} title='Logout'>
        <LogoutOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default Header;
