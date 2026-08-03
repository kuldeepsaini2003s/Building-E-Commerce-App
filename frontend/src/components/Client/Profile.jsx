import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_USER } from "../../utils/constants";
import { setUser } from "../../redux/userSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setPreview(user.avatar || "");
    }
  }, [user]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append("username", username.trim());
    if (avatar) formData.append("avatar", avatar);

    try {
      const { data } = await axios.put(BACKEND_USER, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      dispatch(setUser(data.data));
      setAvatar(null);
      toast.success(data.msg);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-[60vh] bg-gray-50 py-10 px-4">
      <section className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Your profile</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview || "/Photo.png"}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover"
            />
            <label className="cursor-pointer text-sm font-medium text-blue-600">
              Change profile picture
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleAvatarChange}
                className="sr-only"
              />
            </label>
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Profile;
