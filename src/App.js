// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import SearchPage from './pages/SearchPage';
import InquiryTable from './pages/admin';
import UserTable from './pages/users';
import SearchHistoryTable from './pages/Searches';
import Modify from './pages/Modify';

import './App.css'; // This will be your global CSS file

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/inquiry" element={<InquiryTable />} />
        <Route path="/users" element={<UserTable />} />
        <Route path="/searches" element={<SearchHistoryTable />} />
        <Route path="/modify" element={<Modify />} />
      </Routes>
    </Router>
  );
};

export default App;
