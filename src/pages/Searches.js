import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination
} from '@mui/material';
import Header from './Header'; // Make sure to adjust the path as needed
import { useNavigate } from 'react-router-dom';
import verifyUser from '../utils/verifyuser';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  searchQueryCell: {
    width: '40%', // Set the width for the search query column
  },
});

export default function SearchHistoryTable() {
  const classes = useStyles();
  const [searchHistories, setSearchHistories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

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
        } else {
            navigate('/');
        }
      };
    };

    checkUser();
  }, [navigate]);

  useEffect(() => {
    fetch('http://141.164.63.217:4545/searchhistory') // Adjust the URL to your endpoint
      .then(response => response.json())
      .then(data => {
        const formattedRows = data.map(history => ({
          id: history.id,
          username: history.username,
          email: history.email,
          searchQuery: history.search,
          queryTime: history.searchtime // Adjust this field based on your API response
        }));
        setSearchHistories(formattedRows);
      })
      .catch(error => console.error('Error fetching search history:', error));
  }, []);
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Header isAdmin={isAdmin}/> {/* Insert Header component */}
      <Paper>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>유저 ID 번호</TableCell>
                    <TableCell>유저 닉네임</TableCell>
                    <TableCell>유저 이메일</TableCell>
                    <TableCell className={classes.searchQueryCell}>검색 내용</TableCell>
                    <TableCell>검색 시간</TableCell> {/* New column for query time */}
                </TableRow>
            </TableHead>

            <TableBody>
            {searchHistories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((history) => (
                <TableRow key={history.id}>
                <TableCell component="th" scope="row">
                    {history.id}
                </TableCell>
                <TableCell>{history.username}</TableCell>
                <TableCell>{history.email}</TableCell>
                <TableCell className={classes.searchQueryCell}>{history.searchQuery}</TableCell>
                <TableCell>{history.queryTime}</TableCell> {/* Display query time */}
                </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={searchHistories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
