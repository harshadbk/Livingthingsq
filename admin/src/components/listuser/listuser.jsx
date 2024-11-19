import React, { useEffect, useState } from 'react';
import './listuser.css';
import removeIcon from '../../assets/remove.jpg';

const ListUser = () => {
    const [allUsers, setAllUsers] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/alluser');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAllUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const removeUser = async (email) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/removeuser', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            data.success ? alert("User Removed Successfully") : alert("User Removal Failed");
            await fetchData();
        } catch (error) {
            console.error("Error removing user:", error);
            alert("An error occurred while removing the user");
        }
    };

    return (
        <div className='listuser-container'>
            <h2>All Users List</h2>
            <div className="listuser-header">
                <p>Name</p>
                <p>Email</p>
                <p>Password</p>
                <p>Role</p>
                <p>Remove</p>
            </div>
            <div className="listuser-content">
                {allUsers.map((user, index) => (
                    <React.Fragment key={index}>
                        <div className="listuser-row">
                            <p>{user.name}</p>
                            <p>{user.email}</p>
                            <p>{user.password}</p>
                            <p>{user.role}</p>
                            <img 
                                onClick={() => removeUser(user.email)} 
                                src={removeIcon} 
                                alt="Remove User" 
                                className='listuser-remove-icon' 
                            />
                        </div>
                        <hr />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default ListUser;
