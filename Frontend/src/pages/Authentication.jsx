



// src/pages/Authentication.jsx
import React, { useState, useContext } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Container,
  Snackbar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";

const defaultTheme = createTheme();

export default function Authentication() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState("");
  const [formState, setFormState] = useState(0); // 0 = Signin, 1 = Signup
  const [open, setOpen] = useState(false);

  const { handleRegister, handleLogin, loginAsGuest } = useContext(AuthContext);

  const handleAuth = async () => {
    try {
      if (formState === 0) {
        if (!username || !password) throw new Error("All fields are required");
        const result = await handleLogin(username, password);
        setMessages(result);
      } else {
        if (!name || !username || !password)
          throw new Error("All fields are required");
        const result = await handleRegister(name, username, password);
        setMessages(result || "Registered successfully!");
        setFormState(0);
      }
      setOpen(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          {/* Toggle between Sign In / Sign Up */}
          <div>
            <Button
              variant={formState === 0 ? "contained" : "outlined"}
              onClick={() => setFormState(0)}
              sx={{ mr: 1 }}
            >
              Sign In
            </Button>
            <Button
              variant={formState === 1 ? "contained" : "outlined"}
              onClick={() => setFormState(1)}
            >
              Sign Up
            </Button>
          </div>

          <Box
            component="form"
            noValidate
            sx={{ mt: 3, width: "100%" }}
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth();
            }}
          >
            {formState === 1 && (
              <TextField
                margin="normal"
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <TextField
              margin="normal"
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {formState === 0 ? "Sign In" : "Register"}
            </Button>

            {/* 🚀 Continue as Guest */}
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              sx={{ mb: 2 }}
              onClick={loginAsGuest}
            >
              Continue as Guest
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={() => setOpen(false)}
          message={messages}
        />
      </Container>
    </ThemeProvider>
  );
}
