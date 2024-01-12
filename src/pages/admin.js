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
import Header from './Header'; // Adjust the path as needed
import GetAppIcon from '@mui/icons-material/GetApp'; // This is an example, replace with your preferred icon


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
    fetch('http://158.247.255.4:4545/handleinquiry')
      .then(response => response.json())
      .then(data => {
        console.log("!!!========== raw data from backend    ", data.result);
        const formattedRows = data.result.map(inquiry => ({
          id: inquiry.id,
          email: inquiry.email,
          content: inquiry.question,
          status: inquiry.answertime === null ? "대기중" : "완료"
        }));
        setRows(formattedRows);
        console.log("!!!========== formattedRows   ", formattedRows)
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

    console.log("!!!========= newrows ", rows,  "    ", id, "    ", event.target.value);
    if (newStatus === "완료") {
      fetch('http://158.247.255.4:4545/modifyinquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, target: event.target.value })
      }).then(response => {
        if (response.status === 200) {
          console.log('Status updated successfully');
        } else {
          console.error('Failed to update status');
        }
      }).catch(error => console.error('Error updating status:', error));
    }
  };

  // const handleDownload = () => {
  //   const csvRows = [
  //     ['문의자 이메일', '문의 내용', '문의 상태'], // headers
  //     ...rows.map(row => [row.email, row.content, row.status]), // data
  //   ];
  
  //   const csvContent = "data:text/csv;charset=utf-8," + 
  //       csvRows.map(e => e.join(",")).join("\n");
  
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", "inquiries.csv");
  //   document.body.appendChild(link); // Required for FF
  
  //   link.click(); // This will download the data file named "inquiries.csv".
  // };
  const handleDownload = () => {
    const csvRows = [
      ['문의자 이메일', '문의 내용', '문의 상태'], // headers
      ...rows.map(row => [row.email, row.content, row.status]), // data
    ];
  
    const csvContent = "\uFEFF" + csvRows.map(e => e.join(",")).join("\n"); // Add BOM
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inquiries.csv");
    document.body.appendChild(link); // Required for FF
  
    link.click(); // This will download the data file named "inquiries.csv".
  
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url); // Free up storage--no longer needed.
  };
  
  

  const handleDelete = (id) => {
    fetch('http://158.247.255.4:4545/handleinquiry', {
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
    <div>
      <Header isAdmin={isAdmin} />
      <Paper>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                회원들이 문의한 내용을 확인하고, csv 형식으로 내려 받을 수 있습니다
              </TableRow>
              <TableRow>
                <TableCell>문의자 이메일</TableCell>
                <TableCell>문의 내용</TableCell>
                <TableCell>문의 상태</TableCell>
                <TableCell align="right">상태 설정</TableCell>
                <TableCell align="right">
                  <IconButton onClick={handleDownload}>
                    <b style={{fontSize: 15}}>엑셀 다운로드</b>
                    <GetAppIcon />
                  </IconButton>
                </TableCell>
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
                      <MenuItem value="대기중">대기</MenuItem>
                      <MenuItem value="완료">완료</MenuItem>
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
