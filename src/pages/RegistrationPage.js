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

  const handleRegister = () => {
    // Perform registration logic
    navigate('/search');
  };

  const logoClick = () => {
    // Perform login logic
    // https://www.yigam.co.kr/img/logo_210517d.jpg
    navigate('/');
  };

  return (
    <div>
        <div className={classes.header}>
          <img src="https://www.yigam.co.kr/img/logo_210517d.jpg" alt="Logo" className={classes.logo} onClick={() => logoClick()}/>
          <div>
            <span className={classes.navLink} onClick={() => navigate('/login')}>로그인</span>
            <span className={classes.navLink} onClick={() => navigate('/search')}>검색페이지</span>
          </div>
        </div>
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
        <div className={classes.footer}>
          <div>(주)이감 / 대표자: 김봉소 / 사업자등록번호: 120-87-85755 / 통신판매업신고번호: 제 2018-서울서초-1781 / 개인정보관리자: 이상엽</div>
          <div>서울특별시 서초구 강남대로 16길 3 (양재디에스타워, 구 아산벤처타워) 3층</div>
          <div>Copyright © (주)이감. All Rights Reserved.</div>
      </div>
    </div>

  );
};

export default RegistrationPage;
