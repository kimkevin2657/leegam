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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, makeStyles } from '@material-ui/core';
import verifyUser from '../utils/verifyuser';

// Styles defined using makeStyles
const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensure the container fills the viewport height
    backgroundColor: '#fff',
  },
  contentWrap: {
    flex: 1, // Allows this div to grow and fill available space, pushing the footer down
    // ... Other styling as needed
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff', // Changed to white
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(3),
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Added shadow for border effect
  },
  logo: {
    height: '50px', // Adjust as needed
  },
  navLink: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    marginRight: theme.spacing(2),
    '&:last-child': {
      marginRight: 0,
    },
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // height: '100vh',
    minHeight: '100vh', // Changed from height to minHeight
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
  footer: {
    backgroundColor: '#111111',
    color: 'white',
    width: '100%',
    textAlign: 'center', // Center align text
    padding: theme.spacing(2), // Add some padding
    position: 'absolute',
    bottom: 0,
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  useEffect(() => {
    const checkUser = async () => {
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        const result = await verifyUser(access_token);
        if (result.email) {
          navigate('/search');
        } 
      }
    };

    checkUser();
  }, [navigate]);


  const handleLogin = async () => {
    // Perform login logic
    // https://www.yigam.co.kr/img/logo_210517d.jpg
    // navigate('/search');
    const loginData = {
      email: email,
      password: password
    };
    try {
      const response = await fetch('http://141.164.63.217:4545/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        // Save the access_token in local storage
        localStorage.setItem('access_token', data.access_token);
        navigate('/search');
      } else {
        console.error('Login failed');
        // Handle login failure (show error message)
      }
    } catch (error) {
      console.error('There was an error logging in', error);
      // Handle server error (show error message)
    }
  };

  const logoClick = () => {
    // Perform login logic
    // https://www.yigam.co.kr/img/logo_210517d.jpg
    navigate('/');
  };

  return (
    <div className={classes.pageContainer}>
      <div className={classes.contentWrap}>
        {/* Header */}
        <div className={classes.header}>
          <img src="https://www.yigam.co.kr/img/logo_210517d.jpg" alt="Logo" className={classes.logo} onClick={() => logoClick()}/>
          <div>
            <span className={classes.navLink} onClick={() => navigate('/')}>로그인</span>
            <span className={classes.navLink} onClick={() => navigate('/search')}>검색페이지</span>
          </div>
        </div>
        <div className={classes.loginContainer}>
        <TextField
          label="이메일..."
          variant="outlined"
          fullWidth
          className={classes.textField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="비밀번호..."
          type="password"
          variant="outlined"
          fullWidth
          className={classes.textField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      <div className={classes.footer}>
        <div>(주)이감 / 대표자: 김봉소 / 사업자등록번호: 120-87-85755 / 통신판매업신고번호: 제 2018-서울서초-1781 / 개인정보관리자: 이상엽</div>
        <div>서울특별시 서초구 강남대로 16길 3 (양재디에스타워, 구 아산벤처타워) 3층</div>
        <div>Copyright © (주)이감. All Rights Reserved.</div>
      </div>
    </div>
  </div>
  );
};

export default LoginPage;

