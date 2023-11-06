// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { TextField, Button, makeStyles } from '@material-ui/core';

// const LoginPage = () => {
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     // Perform login logic
//     navigate('/search');
//   };

//   return (
//     <div className="login-container">
//       <TextField label="Email" variant="outlined" fullWidth />
//       <TextField label="Password" type="password" variant="outlined" fullWidth />
//       <Button variant="contained" color="primary" onClick={handleLogin}>
//         Log In
//       </Button>
//       <Button variant="text" onClick={() => navigate('/register')}>
//         Registration
//       </Button>
//     </div>
//   );
// };

// export default LoginPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, makeStyles } from '@material-ui/core';

// Styles defined using makeStyles
const useStyles = makeStyles((theme) => ({
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#fff',
  },
  textField: {
    margin: theme.spacing(1),
    width: '90%',
    maxWidth: '400px',
  },
  button: {
    margin: theme.spacing(1),
    textTransform: 'none',
  },
  containedPrimary: {
    backgroundColor: '#1a73e8',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1769aa',
    },
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform login logic
    navigate('/search');
  };

  return (
    <div className={classes.loginContainer}>
      <TextField
        label="이메일..."
        variant="outlined"
        fullWidth
        className={classes.textField}
      />
      <TextField
        label="비밀번호..."
        type="password"
        variant="outlined"
        fullWidth
        className={classes.textField}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        className={`${classes.button} ${classes.containedPrimary}`}
      >
        로그인
      </Button>
      <Button
        variant="text"
        onClick={() => navigate('/register')}
        className={classes.button}
      >
        회원가입
      </Button>
    </div>
  );
};

export default LoginPage;

