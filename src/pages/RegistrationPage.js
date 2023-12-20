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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, makeStyles } from '@material-ui/core';

// Styles defined using makeStyles
const useStyles = makeStyles((theme) => ({
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
    height: '50px',
  },
  navLink: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    marginRight: theme.spacing(2),
    '&:last-child': {
      marginRight: 0,
    },
  },
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
  footer: {
    backgroundColor: '#111111',
    color: 'white',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
}));

const RegistrationPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');


  const handleRegister = async () => {
    if (!validateInputs()) {
      // Stop the registration process if validation fails
      return;
    }
    const registrationData = {
      username: username,
      password: password,
      email: email
    };

    try {
      const response = await fetch('http://141.164.63.217:4545/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      if (response.status === 200 || response.status === 201) {
        // Registration successful, navigate to login
        alert('안녕하세요 '+ username + '님. 회원가입에 성공하였습니다');
        navigate('/');
      } else if (response.status === 409) {
        // User already exists
        alert('이미 존재하는 이메일입니다.');
      } else if (response.status === 408){
        alert('이미 존재하는 닉네임입니다.');
      } else {
        // Other server issues
        alert('서버 이슈입니다. 관리자 문의 부탁드립니다.');
      }
    } catch (error) {
      console.error('There was an error during registration', error);
      // Handle server error (show error message)
      alert('서버 이슈입니다. 관리자 문의 부탁드립니다.');
    }
  };

  const logoClick = () => {
    // Perform login logic
    // https://www.yigam.co.kr/img/logo_210517d.jpg
    navigate('/');
  };

  const validateInputs = () => {
    let isValid = true;
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('유효하지 않은 이메일입니다.');
      isValid = false;
    } else {
      setEmailError('');
    }
  
    // Password validation (example: minimum 8 characters)
    if (password.length < 8) {
      setPasswordError('비밀번호는 최소 8자리 이상입니다.');
      isValid = false;
    } else {
      setPasswordError('');
    }
  
    // Username validation (example: non-empty)
    if (!username.trim()) {
      setUsernameError('닉네임은 필수입니다.');
      isValid = false;
    } else {
      setUsernameError('');
    }
  
    return isValid;
  };
  

  return (
    <div>
        <div className={classes.header}>
          <img src="https://www.yigam.co.kr/img/logo_210517d.jpg" alt="Logo" className={classes.logo} onClick={() => logoClick()}/>
          <div>
            <span className={classes.navLink} onClick={() => navigate('/')}>로그인</span>
            <span className={classes.navLink} onClick={() => navigate('/search')}>검색페이지</span>
          </div>
        </div>
        <div className={classes.registrationContainer}>
          <TextField
            label="이메일..."
            variant="outlined"
            fullWidth
            className={classes.textField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="비밀번호..."
            type="password"
            variant="outlined"
            fullWidth
            className={classes.textField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            label="닉네임..."
            variant="outlined"
            fullWidth
            className={classes.textField}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!usernameError}
            helperText={usernameError}
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
        <div className={classes.footer}>
          <div>(주)이감 / 대표자: 김봉소 / 사업자등록번호: 120-87-85755 / 통신판매업신고번호: 제 2018-서울서초-1781 / 개인정보관리자: 이상엽</div>
          <div>서울특별시 서초구 강남대로 16길 3 (양재디에스타워, 구 아산벤처타워) 3층</div>
          <div>Copyright © (주)이감. All Rights Reserved.</div>
      </div>
    </div>

  );
};

export default RegistrationPage;
