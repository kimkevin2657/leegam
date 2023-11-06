// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { TextField, Button, makeStyles } from '@material-ui/core';
// import './RegistrationPage.css'; // Specific CSS for registration page

// const RegistrationPage = () => {
//   const navigate = useNavigate();

//   const handleRegister = () => {
//     // Perform registration logic
//     navigate('/search');
//   };

//   return (
//     <div className="registration-container">
//       <TextField label="Email" variant="outlined" fullWidth />
//       <TextField label="Password" type="password" variant="outlined" fullWidth />
//       <TextField label="Nickname" variant="outlined" fullWidth />
//       <Button variant="contained" color="primary" onClick={handleRegister}>
//         Register
//       </Button>
//     </div>
//   );
// };

// export default RegistrationPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, makeStyles } from '@material-ui/core';

// Styles defined using makeStyles
const useStyles = makeStyles((theme) => ({
  registrationContainer: {
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
    backgroundColor: '#1a73e8',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1769aa',
    },
  },
}));

const RegistrationPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleRegister = () => {
    // Perform registration logic
    navigate('/search');
  };

  return (
    <div className={classes.registrationContainer}>
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
      <TextField
        label="닉네임..."
        variant="outlined"
        fullWidth
        className={classes.textField}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        className={classes.button}
      >
        회원가입
      </Button>
    </div>
  );
};

export default RegistrationPage;
