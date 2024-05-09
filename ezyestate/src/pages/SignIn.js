import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../component/OAuth";

function Signin() {
  const [formData, setformData] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await axios.post(` http://localhost:4000/api/auth/signin`, {
        email: formData.email,
        password: formData.password,
      });

      console.log(res);

      if (res.data.responseCode === 200) {
        toast.success("Log in succesfull!");
        dispatch(signInSuccess(res.data.responseData));
        localStorage.setItem(
          "user_data",
          JSON.stringify(res.data.responseData.data)
        );
        localStorage.setItem(
          "access_token",
          res.data.responseData.access_token
        );
        navigate("/");
      } else {
        toast.error(res.data.responseMessage);
        dispatch(signInFailure(res.data.responseMessage));
      }
    } catch (err) {
      toast.error(err.message);
      dispatch(signInFailure(err.message));
    } finally {
      setLoading(false);
    }
  };
  console.log(formData);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          className="border  p-3 rounded-lg "
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border  p-3 rounded-lg "
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 p-2">
          {" "}
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 "> Sign-Up</span>
        </Link>
      </div>
    </div>
  );
}

export default Signin;
