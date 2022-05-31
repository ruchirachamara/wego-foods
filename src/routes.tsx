import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './Common/styles/App.css';

import Layout from './Common/layouts/MainLayout';
import HomePage from './Screens/HomePage/HomePage';

const MainRoutes: FC = () => {
	
	return (
        <Router>
            <Layout>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                </Routes>
            </Layout>
        </Router>        
	);
};

export default MainRoutes;