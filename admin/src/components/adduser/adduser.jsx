import React, { useState } from 'react';
import './adduser.css';

const AddUser = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role:""
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleAddUser = async () => {
        console.log(user);
        try {
            const response = await fetch('http://127.0.0.1:5000/adduser', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            data.success ? alert("User Added Successfully") : alert("User Addition Failed");
        } catch (error) {
            console.error("Error adding user:", error);
            alert("An error occurred while adding the user");
        }
    };

    return (
        <div className='adduser-container'>
            <h2>Enter The User's Details</h2>
            <div className="adduser-field">
                <label>Enter The Name</label>
                <input 
                    value={user.name} 
                    onChange={handleChange} 
                    type="text" 
                    name='name' 
                    placeholder='Enter your name' 
                />
            </div>
            <div className="adduser-field">
                <label>Enter The Email</label>
                <input 
                    value={user.email} 
                    onChange={handleChange} 
                    type="email" 
                    name='email' 
                    placeholder='Enter your email' 
                />
            </div>
            <div className="adduser-field">
                <label>Enter The Password</label>
                <input 
                    value={user.password} 
                    onChange={handleChange} 
                    type="password" 
                    name='password' 
                    placeholder='Enter your password' 
                />
            </div>
            <div className="adduser-field">
                <label>Select The Role</label>
                <select value={user.role} onChange={handleChange} name="role" type="role" className='add-product-selector'>
                <option value="Admin">Admin</option>
                <option value="Farmer">Farmer</option>
                <option value="Worker">worker</option>
                <option value="Deliveryboy">Deliveryboy</option>
                <option value="Shopkeeper">Shopkeeper</option>
                <option value="Merchant">Merchant</option>
                 </select>
            </div>
            <button onClick={handleAddUser} className='adduser-btn'>Add User</button>
        </div>
    );
}

export default AddUser;
