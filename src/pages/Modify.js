import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, IconButton, Button } from '@mui/material';
import Header from './Header';
import GetAppIcon from '@mui/icons-material/GetApp';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import verifyUser from '../utils/verifyuser';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination
} from '@mui/material';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

const Modify = () => {
  const classes = useStyles();
  const [file, setFile] = useState(null);
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

  const handleDownload = async () => {
    try {
      // Make a GET request to download the .xlsx file
      const response = await fetch('http://158.247.255.4:4545/modifyfile');
      const blob = await response.blob();

      // Create a Blob URL and trigger the download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'downloadedFile.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Make a POST request to upload the file
      const response = await fetch('http://158.247.255.4:4545/modifyfile', {
        method: 'POST',
        body: formData,
      });
      if (response.status === 200 || response.status === 201){
        alert('File uploaded successfully!');
      } else {
        alert('서버 이슈입니다. 관리자에 문의 부탁드립니다.');
      }
      setFile(null);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <Header isAdmin={isAdmin}/> {/* Insert Header component */}

      <Paper>
        <TableRow>
            백엔드에 갱신된 질의 데이터를 업로드하거나, 현재 사용되고 있는 최신 질의 데이터를 다운로드할 수 있습니다
        </TableRow>
        <div className={classes.buttonContainer}>
            <div style={{height: 100}}></div>
          <IconButton onClick={handleDownload}>
            <b style={{ fontSize: 15 }}>다운로드하기</b>
            <GetAppIcon />
          </IconButton>

          <div style={{height: 100}}></div>

          <input
            accept=".xlsx"
            style={{ display: 'none' }}
            id="contained-button-file"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              업로드하기
            </Button>
          </label>

          {file && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              style={{ marginLeft: 10 }}
            >
              전송하기
            </Button>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default Modify;
