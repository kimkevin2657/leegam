import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import verifyUser from '../utils/verifyuser';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  visuallyHidden: {
    display: 'none',
  },
});

function createData(id, email, content, status) {
  return { id, email, content, status };
}

const initialRows = [
  createData(1, 'user1@example.com', 'I need help with my order.', 'Pending'),
  // ... add more data here
];

export default function InquiryTable() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const navigate = useNavigate();
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
        } else {
            navigate('/');
        }
      };
    };

    checkUser();
  }, [navigate]);

  useEffect(() => {
    fetch('http://141.164.63.217:4545/handleinquiry')
      .then(response => response.json())
      .then(data => {
        const formattedRows = data.result.map(inquiry => ({
          id: inquiry.id,
          email: inquiry.email,
          content: inquiry.question,
          status: inquiry.answertime === null ? "대기중" : "완료"
        }));
        setRows(formattedRows);
      })
      .catch(error => console.error('Error fetching inquiries:', error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (id, event) => {
    const newStatus = event.target.value;
    setRows(rows.map((row) => (row.id === id ? { ...row, status: newStatus } : row)));

    if (newStatus === "완료") {
      fetch('http://141.164.63.217:4545/modifyinquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      }).then(response => {
        if (response.status === 200) {
          console.log('Status updated successfully');
        } else {
          console.error('Failed to update status');
        }
      }).catch(error => console.error('Error updating status:', error));
    }
  };

  const handleDelete = (id) => {
    fetch('http://141.164.63.217:4545/handleinquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    }).then(response => {
      if (response.status === 200) {
        window.location.reload(); // Reload the page to reflect changes
      } else {
        console.error('Failed to delete inquiry');
        }
      }).catch(error => console.error('Error deleting inquiry:', error));
    }

  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>문의자 이메일</TableCell>
              <TableCell>문의 내용</TableCell>
              <TableCell>문의 상태</TableCell>
              <TableCell align="right">상태 설정</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.email}
                </TableCell>
                <TableCell>{row.content}</TableCell>
                <TableCell>
                  <Select
                    value={row.status}
                    onChange={(event) => handleStatusChange(row.id, event)}
                  >
                    <MenuItem value="Pending">대기</MenuItem>
                    <MenuItem value="Finished">완료</MenuItem>
                  </Select>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
