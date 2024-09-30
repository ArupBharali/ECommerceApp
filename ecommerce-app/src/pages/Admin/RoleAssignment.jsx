import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { fetchUsers, fetchUserRoles, assignUserRoles, removeUserRoles } from '../../services/userService';
import { fetchRoles } from '../../services/roleService';
import './styles.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDebounce from '../../hooks/useDebounce';

const RoleAssignment = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [error, setError] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [userOptions, setUserOptions] = useState([]);
    const [rolesToRemove, setRolesToRemove] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [rolesToAssign, setRolesToAssign] = useState([]);
    const debouncedInputValue = useDebounce(inputValue, 300); // Adjust delay as needed

    useEffect(() => {
        const getUsers = async () => {
            try {
                setUsers();
            } catch (err) {
                setError('User Details could not be fetched', err);
            }
        };

        const getRoles = async () => {
            try {
                setAllRoles(await fetchRoles());
            } catch (err) {
                setError('User Details could not be fetched', err);
            }
        };

        getUsers();
        getRoles();
        console.log('users',users);
        console.log('roles',roles);
    }, []);

    const handleUserChange = async (user) => {
        console.log('selected user',user);
        setSelectedUser(user);

        try {
            var data = await fetchUserRoles(user.value);
            setUserRoles(data.roles);
        } catch (err) {
            setError('User Details could not be fetched', err);
        }
    };

    const handleRoleChange = (selectedRoles) => {
        setRolesToRemove(selectedRoles);
    };

    const handleAssignChange = (selectedRoles) => {
        setRolesToAssign(selectedRoles);
    };

    const assignRoles = async () => {
        const roleNames = rolesToAssign.map(role => role.value);
        try {
            console.log('selectedUser',selectedUser);
            await assignUserRoles(selectedUser.value, roleNames);

            var data = await fetchUserRoles(selectedUser.value);
            console.log('fetched user roles again',data);
            setUserRoles(data.roles);

            setRolesToAssign([]);

            toast.success('Roles assigned successfully!'); // Show success notification
        } catch (err) {
            toast.error('Failed to assign roles. Please try again.'); // Show error notification
            setError('Error assigning roles', err);
            console.error(error);
        }
    };

    const removeRoles = async () => {
        try {
            const roleNames = rolesToRemove.map(role => role.value);
            await removeUserRoles(selectedUser.value, roleNames);

            // Refetch user roles
            var data = await fetchUserRoles(selectedUser.value);
            console.log('fetched user roles again',data);
            setUserRoles(data.roles);

            setRolesToRemove([]);

            toast.success('Roles removed successfully!'); // Show success notification
        } catch (err) {
            toast.error('Failed to remove roles. Please try again.'); // Show error notification
            setError('Error removing roles', err);
            console.error(error);
        }
    };

    const handleInputChange = async (value) => {
        setInputValue(value);
    };

    // Effect to fetch users based on debounced input value
    React.useEffect(() => {
        console.log('fetching result for debounced input', debouncedInputValue);
        const fetchData = async () => {
            if (debouncedInputValue.length > 2) {
                try {
                    const result = await fetchUsers(debouncedInputValue);
                    console.log('fetchUsers', result);
                    setUserOptions(result);
                    console.log('userOptions', userOptions);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            } else {
                setUserOptions([]);
            }
        };

        fetchData();
    }, [debouncedInputValue]);

    return (
        <div className="manage-user-roles">
            <h2>Select User</h2>
            <ToastContainer />
            <Select
                onChange={handleUserChange}
                options={userOptions.map(user => ({ value: user.id, label: user.userName }))}
                onInputChange={handleInputChange} // Handle input change for searching
                inputValue={inputValue} // Bind inputValue here
                placeholder="Search for a user..."
                isClearable
                isSearchable
            />
            {selectedUser && (
                <>
                    <h3>Current Roles for {selectedUser.label}:</h3>
                    {userRoles.length > 0 ? (
                        <>
                            <p>You have assigned <strong>{userRoles.length}</strong> role(s):</p>
                            <ul className="role-list">
                                {userRoles.map(role => (
                                    <li key={role} className="role-item">
                                        {role}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No roles assigned to this user.</p>
                    )}
                    <h3>Select Other Roles to Assign:</h3>
                    <Select
                        options={allRoles
                            .filter(role => !userRoles.includes(role.name))
                            .map(role => ({ value: role.name, label: role.name }))}
                        isMulti
                        value={rolesToAssign}  // Bind this to rolesToRemove
                        onChange={handleAssignChange}
                        placeholder="Select roles to assign"
                    />
                    <button onClick={assignRoles}>Assign Roles</button>

                    <h3>Select Roles to Remove:</h3>
                    <Select
                        options={userRoles.map(role => ({ value: role, label: role }))}
                        isMulti
                        value={rolesToRemove}  // Bind this to rolesToRemove
                        onChange={handleRoleChange}
                        placeholder="Select roles to remove"
                    />
                    <button onClick={removeRoles}>Remove Roles</button>
                </>
            )}
        </div>
    );
};

export default RoleAssignment;
