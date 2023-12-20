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
  TablePagination,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import verifyUser from '../utils/verifyuser';
import { Alert } from '@material-ui/lab';
import logoImage from '../leegam-logo-header.png';

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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
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
  numberCell: {
    width: '10%', // Width for the "번호" cell
    textAlign: 'center'
  },
  contentCell: {
    width: '40%', // Width for the "답변 내용" cell
  },
  scoreCell: {
    width: '10%', // Width for the "정확도 수치" cell
    textAlign: 'center'
  },
  

}));

// const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const SearchPage = () => {
  const classes = useStyles();
  const [searchResults, setSearchResults] = useState([
  ]);
  const [searchResultsAnswers, setSearchResultsAnswers] = useState([
  ]);
  const [score, setScore] = useState([]);
  const [indices, setIndices] = useState([]);

  const [loading, setLoading] = useState(false); // State to manage loading status

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

  const [inquiryError, setInquiryError] = useState('');


  const [currentPageResults, setCurrentPageResults] = useState([]);
  const [currentPageResultsAnswers, setCurrentPageResultsAnswers] = useState([]);
  const [currentPageScores, setCurrentPageScores] = useState([]);
  const [currentPageIndices, setCurrentPageIndices] = useState([]);


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
  }, [navigate, searchResults, searchResultsAnswers, page, currentPageResults, currentPageScores]);

  // // Handle change page
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  //   // Additional logic to load data for the new page
  // };
  const handleChangePage = (event, newPage) => {
    
    setPage(newPage); // Update the current page
    // No need to call the API again, just slice the current search results
    const startIndex = (newPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const newPagedResults = searchResults.slice(startIndex, endIndex);
    const newPagedResultsAnswers = searchResultsAnswers.slice(startIndex, endIndex);
    const newPagedScores = score.slice(startIndex, endIndex);
    const newPagedIndices = indices.slice(startIndex, endIndex);
  
    console.log("!!========== handleChangePage   ", newPage, "   newdata ", newPagedResults);
    // Update the state with the new slices for the current page
    setCurrentPageResults(newPagedResults);
    setCurrentPageResultsAnswers(newPagedResultsAnswers);
    setCurrentPageScores(newPagedScores);
    setCurrentPageIndices(newPagedIndices);
    window.scrollTo(0,0);
  };
  
  // Add new state variables to hold the current page's data
  

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setPage(1)
    try {
      const access_token = localStorage.getItem('access_token');
      const response = await fetch('http://141.164.63.217:4545/getranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query,
          access_token: access_token,
          search_text: query
         })
      });

      if (response.ok) {
        
        const data = await response.json();
        console.log("!!!======== data   ", data);
        setSearchResults(data.rankingQuestions);
        setSearchResultsAnswers(data.rankingAnswers);
        setScore(data.accuracy);
        setIndices(data.indices);
        setShowResults(true); // Show the table with results

        setCurrentPageResults(data.rankingQuestions.slice(0, rowsPerPage));
        setCurrentPageResultsAnswers(data.rankingAnswers.slice(0, rowsPerPage));
        setCurrentPageScores(data.accuracy.slice(0, rowsPerPage));
        setCurrentPageIndices(data.indices.slice(0, rowsPerPage));

      } else {
        // Handle non-200 responses
        setSnackbarMessage('검색 결과를 가져오는 데 실패했습니다.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Search request failed', error);
      setSnackbarMessage('서버 오류로 검색 요청에 실패했습니다.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  const handleInquiryChange = (event) => {
    setInquiry(event.target.value);
  };

  const handleSendInquiry = async () => {
    setInquiryError('');
    if (inquiry.length < 10) {
      setInquiryError('문의 내용은 최소 10자 이상이어야 합니다.');
      return; // Stop the function if the validation fails
    }

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
          <img src={logoImage} alt="Logo" className={classes.logo} onClick={() => logoClick()}/>
          <div>
            <span className={classes.navLink} onClick={handleLogout}>로그아웃</span>
            {isAdmin ? 
              <span className={classes.navLink} onClick={() => navigate('/inquiry')}>관리자</span>
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                검색하기
                </Button>
            </form>
            {loading ? (
              <div className={classes.loadingContainer}>
                <CircularProgress />
                <Typography variant="h6">AI 모델이 검색 중입니다. 잠시만 기다려주세요</Typography>
              </div>
            ) : (
              <>
                  {showResults &&  (
                    <>
                        <TableContainer component={Paper} className={classes.tableContainer} key={page}>
                          <Table aria-label="search results">
                          <TableHead>
                              <TableRow>
                                  <TableCell className={classes.numberCell} >번호</TableCell>
                                  <TableCell className={classes.contentcell} >질문 내용</TableCell>
                                  <TableCell className={classes.contentcell} >답변 내용</TableCell>
                                  <TableCell className={classes.scoreCell} >정확도 수치</TableCell>
                              </TableRow>
                          </TableHead>
          
                          <TableBody>
                            {currentPageResults.map((result, index) => (
                              <TableRow key={index} className={classes.tableRow}>
                                <TableCell className={classes.numberCell}>
                                  {(page - 1) * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell className={classes.contentCell}>
                                  {currentPageResults[index]} {/* Assuming result is the content */}
                                </TableCell>
                                <TableCell className={classes.contentCell}>
                                  {currentPageResultsAnswers[index]} {/* Assuming result is the content */}
                                </TableCell>
                                <TableCell className={classes.scoreCell}>
                                  {Number.parseFloat(currentPageScores[index]).toFixed(2)} {/* Assuming score is an array with corresponding indices */}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>

                          </Table>
                      </TableContainer>
                      <Pagination
                        count={count} // Total number of pages
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </>
                  )}
              </>
            )}
            <div className={classes.inquirySection}>
                <TextField
                  className={classes.inquiryInput}
                  label="관리자에게 문의 주시면, 최대한 빠른 시일내에 이메일 답변 전달 드립니다."
                  variant="outlined"
                  value={inquiry} 
                  multiline
                  onChange={handleInquiryChange}
                  error={!!inquiryError} // This will apply the error styling if there is an error message
                  helperText={inquiryError} // This will display the error message
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
