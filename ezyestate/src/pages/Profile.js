import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  list,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutUserStart,
  logoutUserSuccess,
  logoutUserFailure,
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
  const [showListingError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const access_token = localStorage.getItem("access_token");
  const userData = localStorage.getItem("user_data");
  const decoded = jwtDecode(access_token);
  const userData2 = JSON.parse(userData);

  //  console.log(userData2);
  const avatar = userData2.responseData?.data?.avatar;
  if (avatar) {
    console.log(avatar);
  }

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
        toast.error("OOPs Profile update unsuccessfull!", data.message);
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
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `http://localhost:4000/api/user/delete/${decoded.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            access_token: access_token,
          },
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess(data));
      localStorage.removeItem("user_data");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = () => {
    try {
      dispatch(logoutUserStart());
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      dispatch(logoutUserSuccess());
      toast.success("Logged Out Successfully!!!");
    } catch (error) {
      toast.error("Couldn't Logout!,try again");
      dispatch(logoutUserFailure());
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await fetch(
        `http://localhost:4000/api/user/listings/${decoded.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            access_token: access_token,
          },
        }
      );

      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            access_token: access_token,
          },
        }
      );
      const data = await res.json();
      if (data.success == false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>({
        ...prev,
        responseData:prev.responseData.filter((listing) => listing.id !== listingId)
     }));
    } catch (err) {
      console.log(err.message);
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
          src={
            formData.avatar ||
            userData2?.avatar ||
            userData2?.responseData?.data?.avatar
          }
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
          defaultValue={
            currentUser.username || userData2?.responseData?.data?.username
          }
          className="border p-3 rounded-lg"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          defaultValue={
            currentUser.email || userData2?.responseData?.data?.email
          }
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
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-400 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-400 cursor-pointer">
          Sign out
        </span>
      </div>
      <button onClick={handleShowListings} className="text-green-700 w-full ">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? "Error showing listings" : ""}
      </p>

      {userListings &&
        userListings.responseData &&
        userListings.responseData.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-2xl font-semibold ">
              Your Listings
            </h1>
            {userListings.responseData.map((listing) => (
              <div
                key={listing.id}
                className="border rounded-lg p-3 flex justify-between items-center gap-4 "
              >
                <Link to={`/listing/${listing.id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain"
                  ></img>
                </Link>
                <Link
                  className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                  to={`/listing/${listing.id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleListingDelete(listing.id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing.id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                  </Link>
                  
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default Profile;
