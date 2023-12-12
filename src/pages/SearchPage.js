import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  AppBar,
  Toolbar,
  Typography,
  TablePagination
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import verifyUser from '../utils/verifyuser';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#fff',
  },
  contentWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  registrationContainer: {
    width: '100%', // Adjust as needed
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
  // searchContainer: {
  //   padding: theme.spacing(2),
  //   textAlign: 'center',
  //   backgroundColor: '#f5f5f5',
  //   minHeight: '100vh',
  // },
  searchContainer: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center align children horizontally
    justifyContent: 'center', // Center align children vertically
  },
  searchBar: {
    margin: theme.spacing(2, 0),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '60%',
    },
  },
  table: {
    marginTop: theme.spacing(2),
  },
  // inquirySection: {
  //   marginTop: theme.spacing(2),
  // },
  // inquiryInput: {
  //   width: '60%',
  //   marginBottom: theme.spacing(2),
  // },
  inquirySection: {
    width: '100%',
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      width: '60%',
    },
    margin: theme.spacing(2, 0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Aligns children (TextField and Button) in the center
  },
  inquiryInput: {
    width: '100%', // Takes full width of its parent (inquirySection)
    marginBottom: theme.spacing(2),
    '& .MuiInputBase-input': {
      height: '4rem', // Double the height of the input
    },
  },
  searchForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // This ensures the children align horizontally at the center
    justifyContent: 'center', // This will center the children vertically
    '& > *': { // Applies to all immediate children
      margin: theme.spacing(1), // Spacing between each child
    },
    width: "100%",
  },
  topBanner: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logoutButton: {
    marginRight: theme.spacing(2),
  },
  tableRow: {
    '& > *': {  // Targets all TableCell components within the TableRow
      paddingTop: theme.spacing(3),  // Add padding to the top of the cell
      paddingBottom: theme.spacing(3),  // Add padding to the bottom of the cell
    },
  },
  tableContainer: {
    width: '100%',
    margin: 'auto', // Center align the table
    [theme.breakpoints.up('md')]: {
      width: '60%',
    },
    marginTop: theme.spacing(2),
  },

}));

// const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const SearchPage = () => {
  const classes = useStyles();
  const [searchResults, setSearchResults] = useState([]);
  const [open, setOpen] = useState(false);

  const [inquiry, setInquiry] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();

  // State for current page
  const [page, setPage] = useState(1);


  useEffect(() => {
    const checkUser = async () => {
      const access_token = localStorage.getItem('access_token');
      if (!access_token){
        navigate('/');
      } else {
        const result = await verifyUser(access_token);
        if (!result){
          navigate('/');
        } else {
          if (result.email === null){
            navigate('/');
          }
        }
      }

    };

    checkUser();
  }, [navigate]);

  // Handle change page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Additional logic to load data for the new page
  };

  const handleSearch = (event) => {
    event.preventDefault();
    // Here, you would add your search logic and update the searchResults state.
    setSearchResults([]); // Replace with actual search result
  };

  const handleInquiryChange = (event) => {
    setInquiry(event.target.value);
  };

  const handleSendInquiry = async () => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      // Handle the case where there is no access token
      alert('로그인이 필요합니다.');
      return;
    }

    const inquiryData = {
      access_token: access_token,
      question: inquiry
    };

    try {
      const response = await fetch('http://141.164.63.217:4545/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData)
      });

      if (response.status === 201) {
        setSnackbarMessage('문의 신청이 완료 되었습니다. 곧 관리자가 이메일로 답변을 드리겠습니다.');
        setOpenSnackbar(true);
        setInquiry(''); // Clear the inquiry input
      } else {
        // Handle other response statuses (e.g., error cases)
        setSnackbarMessage('문의 전송에 실패했습니다.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error sending inquiry', error);
      setSnackbarMessage('서버 오류로 문의 전송에 실패했습니다.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleLogout = () => {
    // Logic for logging out the user
    localStorage.removeItem('access_token');
    navigate('/');
  };

  const logoClick = () => {
    // Perform login logic
    // https://www.yigam.co.kr/img/logo_210517d.jpg
    navigate('/search');
  };

  return (
    <div>
        <div className={classes.header}>
          <img src="https://www.yigam.co.kr/img/logo_210517d.jpg" alt="Logo" className={classes.logo} onClick={() => logoClick()}/>
          <div>
            <span className={classes.navLink} onClick={handleLogout}>로그아웃</span>
            <span className={classes.navLink} onClick={() => navigate('/search')}>검색페이지</span>
          </div>
        </div>
        <div className={classes.searchContainer}>
            <form onSubmit={handleSearch} className={classes.searchForm}>
                <TextField
                className={classes.searchBar}
                variant="outlined"
                placeholder="질문을 입력해주세요..."
                fullWidth
                />
                <Button type="submit" variant="contained" color="primary">
                검색하기
                </Button>
            </form>
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table aria-label="search results">
                <TableHead>
                    <TableRow>
                        <TableCell>질문</TableCell>
                        <TableCell>질문 내용 샘플</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Render search results here */}
                    {/* Example static row */}
                    <TableRow className={classes.tableRow}>
                        <TableCell>답변 1</TableCell>
                        <TableCell>답변 내용 1</TableCell>
                    </TableRow>
                    <TableRow className={classes.tableRow}>
                        <TableCell>답변 2</TableCell>
                        <TableCell>답변 내용 2</TableCell>
                    </TableRow>
                    <TableRow className={classes.tableRow}>
                        <TableCell>답변 3</TableCell>
                        <TableCell>답변 내용 3</TableCell>
                    </TableRow>
                    <TableRow className={classes.tableRow}>
                        <TableCell>답변 4</TableCell>
                        <TableCell>답변 내용 4</TableCell>
                    </TableRow>
                    <TableRow className={classes.tableRow}>
                        <TableCell>답변 5</TableCell>
                        <TableCell>답변 내용 5</TableCell>
                    </TableRow>
                    <TableRow className={classes.tableRow}>
                        <TableCell>답변 6</TableCell>
                        <TableCell>답변 내용 6</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </TableContainer>
            <Pagination
              count={10} // Total number of pages
              page={page}
              onChange={handleChangePage}
              color="primary"
              showFirstButton
              showLastButton
            />
            <div className={classes.inquirySection}>
                <TextField
                className={classes.inquiryInput}
                label="문의 입력 ..."
                variant="outlined"
                value={inquiry}
                multiline
                onChange={handleInquiryChange}
                />
                <Button
                variant="contained"
                color="secondary"
                onClick={handleSendInquiry}
                >
                문의하기
                </Button>
            </div>
            <Snackbar 
              open={openSnackbar} 
              autoHideDuration={6000} 
              onClose={handleCloseSnackbar}
            >
              <Alert onClose={handleCloseSnackbar} severity="success">
                {snackbarMessage}
              </Alert>
            </Snackbar>
        </div>
    </div>
  );
};

export default SearchPage;
