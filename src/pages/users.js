import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, IconButton, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from './Header'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import verifyUser from '../utils/verifyuser';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const initialRows = [
  // Sample data
  { id: 1, username: 'user1', email: 'user1@example.com' },
  { id: 2, username: 'user2', email: 'user2@example.com' },
  // Add more rows as needed
];

export default function UserTable() {
  const classes = useStyles();
  const [rows, setRows] = useState([]); // In a real app, this data would come from an API
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch data from API and update 'rows' state
  }, []);

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
    fetch('http://141.164.63.217:4545/users')
      .then(response => response.json())
      .then(data => {

        const formattedRows = data.result.map(user => ({
            id: user.id,
            email: user.email,
            username: user.username,
            status: user.status
        }))
        setRows(formattedRows);
        console.log("!!!========== formattedRows   ", formattedRows)
      })
      .catch(error => console.error('Error fetching inquiries:', error));
  }, []);

  const handleAdminChange = async (id, newAdminStatus) => {
    // Make a POST request to change the admin status
    const access_token = localStorage.getItem('access_token');
    const response = await fetch('http://141.164.63.217:4545/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id, status: newAdminStatus }),
    });

    if (response.status === 200) {
      // Update the 'admin' property for the corresponding row
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, admin: newAdminStatus } : row
        )
      );
      window.location.reload();
    } else {
      console.error('Failed to update admin status');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    // Delete logic (API call) and then update state
    fetch('http://141.164.63.217:4545/users', {
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
    setRows(rows.filter(row => row.id !== id));
  };

  return (
    <div>
      <Header isAdmin={true} /> {/* Assuming isAdmin is true for demonstration */}
      <Paper>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                현재 가입한 회원들의 정보가 게시되며, 관리자 권한을 부여할 수 있습니다
              </TableRow>
              <TableRow>
                <TableCell>ID 번호</TableCell>
                <TableCell>닉네임</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>관리자</TableCell>
                <TableCell align="right">삭제하기</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Select
                      value={row.status}
                      onChange={(e) => handleAdminChange(row.id, e.target.value)}
                    >
                      <MenuItem value="user">유저</MenuItem>
                      <MenuItem value="admin">관리자</MenuItem>
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
    </div>
  );
}
