// Header.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: theme.spacing(1, 2),
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
  // Add other styles related to the header here
}));

const Header = ({ isAdmin }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  const logoClick = () => {
    navigate('/search');
  };

  return (
    <div className={classes.header}>
      <img src="https://www.yigam.co.kr/img/logo_210517d.jpg" alt="Logo" className={classes.logo} onClick={logoClick} />
      <div>
        <span className={classes.navLink} onClick={handleLogout}>로그아웃</span>
        {isAdmin ? 
            <>
                <span className={classes.navLink} onClick={() => navigate('/users')}>유저관리</span>
                <span className={classes.navLink} onClick={() => navigate('/inquiry')}>문의관리</span>
                <span className={classes.navLink} onClick={() => navigate('/searches')}>검색내역</span>
            </>
          :
          <span className={classes.navLink} onClick={() => navigate('/search')}>검색페이지</span>
        }
      </div>
    </div>
  );
};

export default Header;
