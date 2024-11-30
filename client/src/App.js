import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import EditorPage from './components/Editor';
import ViewerPage from './components/Viewer';
import EditModal from './components/EditModal';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/:id/editor" element={<EditorPage />} />
        <Route path="/:id/editor/edit" element={<EditModal />} />
        <Route path="/:id/viewer" element={<ViewerPage />} />
      </Routes>
    </Router>
  );
};

export default App;
