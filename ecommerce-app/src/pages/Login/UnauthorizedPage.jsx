// pages/UnauthorizedPage.js
import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import './UnauthorizedPage.css';

const UnauthorizedPage = () => {
    return (
        <div style={{ padding: '50px' }}>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                    <Link to="/">
                        <Button type="primary">Back to Home</Button>
                    </Link>
                }
            />
        </div>
    );
};

export default UnauthorizedPage;
