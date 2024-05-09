import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  const access_token = localStorage.getItem("access_token");
  const userData = localStorage.getItem("user_data");
  const decoded = jwtDecode(access_token);
  const userData2 = JSON.parse(userData);

  //  console.log(userData2);
  //  console.log(userData2.responseData.data.avatar)
  // console.log(filePerc);
  // console.log(fileUploadError);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }

    setFormData({
      ...formData,
      username: userData2.username,
      email: userData2.email,
    });
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(
        // `http://localhost:4000/api/user/update/${currentUser.user_id}`,
        `http://localhost:4000/api/user/update/${decoded.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            access_token: access_token,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error("OOPs Profile update unsuccessfull!",data.message);
        return;
      }
      toast.success("Profile updated successfully!");
      const updatedUserData = { ...userData2, ...formData };
      localStorage.setItem("user_data", JSON.stringify(updatedUserData));

      
      // console.log(currentUser.user_id);
      // console.log("control comes here");
      // console.log(data, decoded);
      dispatch(updateUserSuccess(data));
    } catch (err) {
      dispatch(updateUserFailure(err));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || userData2?.avatar||userData2?.responseData?.data?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center ">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload (Image must be less than 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-green-700"> {`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Successfully Uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="username"
          required
          defaultValue={currentUser.username||userData2?.responseData?.data?.username }
          className="border p-3 rounded-lg"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email||userData2?.responseData?.data?.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
  
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-400 cursor-pointer">Delete Account</span>
        <span className="text-red-400 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
  
}

export default Profile;
