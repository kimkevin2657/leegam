import React, { useState } from 'react';
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
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
  inquirySection: {
    marginTop: theme.spacing(2),
  },
  inquiryInput: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  searchForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // This ensures the children align horizontally at the center
    justifyContent: 'center', // This will center the children vertically
    '& > *': { // Applies to all immediate children
      margin: theme.spacing(1), // Spacing between each child
    },
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
}));

// const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const SearchPage = () => {
  const classes = useStyles();
  const [searchResults, setSearchResults] = useState([]);
  const [inquiry, setInquiry] = useState('');
  const [open, setOpen] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();
    // Here, you would add your search logic and update the searchResults state.
    setSearchResults([]); // Replace with actual search result
  };

  const handleInquiryChange = (event) => {
    setInquiry(event.target.value);
  };

  const handleSendInquiry = () => {
    // Here, you would add your logic to send the inquiry.
    setOpen(true);
    setInquiry('');
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleLogout = () => {
    // Logic for logging out the user
  };

  return (
    <div>
      <AppBar position="static" color="default" className={classes.topBanner}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            로고
          </Typography>
          <Button color="inherit" onClick={handleLogout} className={classes.logoutButton}>
            로그아웃
          </Button>
        </Toolbar>
      </AppBar>
        <div className={classes.searchContainer}>
            <form onSubmit={handleSearch} className={classes.searchForm}>
                <TextField
                className={classes.searchBar}
                variant="outlined"
                placeholder="Search..."
                fullWidth
                />
                <Button type="submit" variant="contained" color="primary">
                Search
                </Button>
            </form>
            <TableContainer component={Paper} className={classes.table}>
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
            <div className={classes.inquirySection}>
                <TextField
                className={classes.inquiryInput}
                label="문의 입력 ..."
                variant="outlined"
                value={inquiry}
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
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                {/* <Alert onClose={handleClose} severity="success">
                Your inquiry has been sent!
                </Alert> */}
            </Snackbar>
        </div>
    </div>
  );
};

export default SearchPage;
