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
  // tableRow: {
  //   '& > *': {  // Targets all TableCell components within the TableRow
  //     paddingTop: theme.spacing(3),  // Add padding to the top of the cell
  //     paddingBottom: theme.spacing(3),  // Add padding to the bottom of the cell
  //   },
  // },
  tableRow: {
    '& > *': {
      width: '50%', // Equal width for both cells
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
  },
  // tableContainer: {
  //   width: '100%',
  //   margin: 'auto', // Center align the table
  //   [theme.breakpoints.up('md')]: {
  //     width: '60%',
  //   },
  //   marginTop: theme.spacing(2),
  // },
  tableContainer: {
    width: '100%', // Double the width
    margin: 'auto',
    [theme.breakpoints.up('md')]: {
      width: '100%', // Adjusted width on medium devices and up
    },
    marginTop: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
  },

}));

// const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const SearchPage = () => {
  const classes = useStyles();
  const [searchResults, setSearchResults] = useState([
  ]);
  const [open, setOpen] = useState(false);

  const [inquiry, setInquiry] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();

  const rowsPerPage = 20; 
  const count = Math.ceil(searchResults.length / rowsPerPage);
  // State for current page
  const [page, setPage] = useState(1);
  
  const [showResults, setShowResults] = useState(false); // New state to control the display of the table
  const [query, setQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

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
      const response = await fetch('http://141.164.63.217:4545/verifyadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({access_token: access_token})
      });

      if (response.status === 200) {
        const responseJson = await response.json();
        if (responseJson.status === "admin"){
          setIsAdmin(true);
        }
      };
    };

    checkUser();
  }, [navigate]);

  // Handle change page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // Additional logic to load data for the new page
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://141.164.63.217:4545/getranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.ranking);
        setShowResults(true); // Show the table with results
      } else {
        // Handle non-200 responses
        setSnackbarMessage('검색 결과를 가져오는 데 실패했습니다.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Search request failed', error);
      setSnackbarMessage('서버 오류로 검색 요청에 실패했습니다.');
      setOpenSnackbar(true);
    }
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
            {isAdmin ? 
              <span className={classes.navLink} onClick={() => navigate('/inquiry')}>문의보기</span>
              :
              <span className={classes.navLink} onClick={() => navigate('/search')}>검색페이지</span>
            }
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
            {showResults &&  (
              <>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table aria-label="search results">
                    <TableHead>
                        <TableRow>
                            <TableCell>질문</TableCell>
                            <TableCell>답변 내용</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Render search results here */}
                        {/* Example static row */}
                        {searchResults
                          .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                          .map((result, index) => (
                          <TableRow key={index} className={classes.tableRow}>
                              <TableCell>{result[0]}</TableCell>
                              <TableCell>{result[1]}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                  count={10} // Total number of pages
                  page={page}
                  onChange={(event, newPage) => setPage(newPage)}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </>
            )}
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
