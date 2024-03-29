import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, IconButton, Button
} from '@mui/material';
import Header from './Header'; // Make sure to adjust the path as needed
import { useNavigate } from 'react-router-dom';
import verifyUser from '../utils/verifyuser';
import GetAppIcon from '@mui/icons-material/GetApp'; 
import Footer from './Footer';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  searchQueryCell: {
    width: '40%', // Set the width for the search query column
  },
  body: {
    paddingTop: '66px',
  },
  download: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downloadBtn: {
    border: '1px solid rgba(0, 0, 0, 0.54)',
    borderRadius: '8px',
    margin: '5px'
  }
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
      const response = await fetch('http://158.247.255.4:4545/verifyadmin', {
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
    fetch('http://158.247.255.4:4545/searchhistory') // Adjust the URL to your endpoint
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

  const handleDownload = () => {
    if (!window.confirm('모든데이터가 다운로드 됩니다.')) {
      return;
    }
    const csvRows = [
      ['닉네임', '이메일', '검색 쿼리', '검색 시간'], // headers
      ...searchHistories.map(row => [row.username, row.email, row.searchQuery, row.queryTime]), // data
    ];
  
    const csvContent = "\uFEFF" + csvRows.map(e => e.join(",")).join("\n"); // Add BOM
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "searches.csv");
    document.body.appendChild(link); // Required for FF
  
    link.click(); // This will download the data file named "inquiries.csv".
  
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url); // Free up storage--no longer needed.
  };

  return (
    <div>
      <Header isAdmin={isAdmin}/> {/* Insert Header component */}
      <Paper className={classes.body}>
        <div className={classes.download} align="right">
          <div>
          회원들의 검색 내역을 조회할 수 있습니다
          </div>
          <div className={classes.downloadBtn}>
            <Button onClick={handleDownload} endIcon={<GetAppIcon />} style={{color: 'rgba(0, 0, 0, 0.54)'}}>
              <b style={{fontSize: 15}}>엑셀 다운로드</b>
            </Button>
          </div>
        </div>
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
          rowsPerPageOptions={[]}
          component="div"
          count={searchHistories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={() => {
            return `${page+1}-${Math.floor(searchHistories.length / rowsPerPage)+1}`;
          }}
        />
      </Paper>
      <Footer />
    </div>
  );
}
