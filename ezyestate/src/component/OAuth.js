import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function OAuth() {
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const handleGoogleClick= async ()=>{
        try{
            const provider=  new GoogleAuthProvider()
            const auth= getAuth(app)
            const result = await signInWithPopup(auth,provider)
            const res= await fetch(`http://localhost:4000/api/auth/google`,{
              method:'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name:result.user.displayName,
                email:result.user.email,
                avatar:result.user.photoURL
              }),
  
            });
            const data= await res.json();
            dispatch(signInSuccess(data));
            localStorage.setItem('user_data',JSON.stringify(data));
            localStorage.setItem(
          "access_token",
          data.responseData.access_token
        );
            toast.success("Log in succesfull!");
            navigate('/');
        }catch(error){
            console.log('could not sign in with google',error)
        }
    }
  return (
    <button  onClick={handleGoogleClick}  type='button' className='bg bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>continue with google</button>
  )
}

export default OAuth;