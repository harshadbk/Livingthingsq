import React from 'react';
import './unsubscribe.css';
import Remove from '../../assets/remove.jpg';
import { useState } from 'react';
import { useEffect } from 'react';

const unsubscribe = () => {

  const [listsubs,setlistsubs] = useState([]);

  const fetchinfo =async ()=>{
    await fetch('http://127.0.0.1:5000/getsub')
    .then((resp)=>resp.json())
    .then((data)=>setlistsubs(data))
  }

  useEffect(()=>{
    fetchinfo();
  },[]);

  const unsubs = async (email)=>{
    await fetch('http://127.0.0.1:5000/unsub',{
       method:'POST',
       headers:{
        Accept:'application/json',
        'Content-Type':'application/json',
       },
       body:JSON.stringify({email:email})
    })
    await fetchinfo();
  }


  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className='subscribe'>
      <h1>List Of Subscribers</h1>
      <br />
      <div className="listsubs-format-main">
        <p>Username</p>
        <p>Email</p>
        <p>Time</p>
        <p>Removed</p>
      </div>
      <div className="listsubs-alluser">
        {listsubs.map((subs,index)=>{
          return <>
          <div key={index} className="listusers-format-main listusers-format">
            <p>{subs.user}</p>
            <p>{subs.email}</p>
            <p>{formatDate(subs.date)}</p>
            <img onClick={()=>{unsubs(subs.email)}} src={Remove} alt="remove" className='listsubs-remove-icon' />
          </div>
          </>
        })}
      </div>
    </div>
  )
}

export default unsubscribe
