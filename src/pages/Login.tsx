import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Box, Typography, Container, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import toast from 'react-hot-toast';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // // Select authentication state from Redux
    // const isAuthenticated = JSON.parse(localStorage.getItem('user') || '{}');

    // // Redirect if authenticated
    // useEffect(() => {
    //     if (isAuthenticated) {
    //         navigate('/dashboard'); // Ensure the route is correct here
    //     }
    // }, [isAuthenticated, navigate]);

    const handleLogin = () => {
        if (username === '' || password === '') {
            toast.error('Username and password are required');
            return;
        }

        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify({ username, password }));

        navigate('/dashboard')
        toast.success("Login Successfully")

        // Dispatch login action
        dispatch(login({ username, password }));

    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: "100vh" }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: "100%"
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 3,
                            fontWeight: 'bold',
                            color: '#FF742B'
                        }}
                    >
                        Login
                    </Typography>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        margin="normal"
                        fullWidth
                        required
                        autoFocus
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#FF0000',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#FF0000',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#FF0000',
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: '#FF0000',
                            }
                        }}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        fullWidth
                        required
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'red',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'red',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'red',
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: '#FF0000',
                            }
                        }}
                    />
                    <Button
                        onClick={handleLogin}
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{
                            background: "#FF742B",
                            py: 1.5,
                            textTransform: 'none',
                            fontSize: '1.1rem'
                        }}
                    >
                        Login
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
