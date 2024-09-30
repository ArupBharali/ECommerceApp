import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '.././context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ roles, element }) => {
    const { roles: userRoles } = useContext(AuthContext);
    const location = useLocation();

    const hasRequiredRole = roles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
        // Redirect to /unauthorized if the user does not have the required role
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    // Render the element if the user has the required role
    return element;
};

// Add prop-types validation
ProtectedRoute.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,  // roles must be an array of strings
    element: PropTypes.element.isRequired,  // element must be a valid React element
};

export default ProtectedRoute;
