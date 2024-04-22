import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';


function Signin() {
  const [formData, setformData]= useState({});
  const navigate= useNavigate();
   const handleChange=(e) => {
    //  setformData({
    //    ...formData,
    //    [e.target.id]:e.target.value,
    //  })
 
   }
 
   const handleSubmit= async(e) =>{
    //  e.preventDefault();
    //  try{
    //    const res= await axios.get(
    //     ` http://localhost:4000/api/auth/signup`,{username:formData.username, email: formData.email,password:formData.password}
    //    );
 
    //    console.log(res);
 
    //    if(res.data.responseCode=== 200){
    //      toast.success("Registration completed");
    //      navigate('/sign-in');
    //    }else{
    //      toast.error(res.data.responseMessage);
    //    }
    //  }
    //  catch(err){
    //    toast.error(err);
    //  }
   }
   console.log(formData)



  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="text" placeholder='username' className='border  p-3 rounded-lg ' id='username' onChange={handleChange}/>
        <input type="email" placeholder='email' className='border  p-3 rounded-lg ' id='email' onChange={handleChange}/>
        <input type="password" placeholder='password' className='border  p-3 rounded-lg ' id='password' onChange={handleChange}/>
        <button className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 p-2' > Sign up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>
          Have an account?
        </p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700 '> Sign-in</span>
        </Link>
      </div>
    </div>

  
   
  )
}

export default Signin