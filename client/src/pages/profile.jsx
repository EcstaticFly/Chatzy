import { useState } from "react";
import { authStore } from "../store/authStore";
import { Camera, Mail, User, Trash2, X } from "lucide-react";

export default function ProfilePage() {
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const { updateProfile, isUpdating, user, deleteProfilePic, isDeletingImage } =
    authStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleDeleteImage = async () => {
    await deleteProfilePic();
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <label
                htmlFor="delete-profilePic"
                className={`
                  absolute bottom-0 left-0 
                  bg-red-400 hover:scale-105
                  p-0.5 rounded-full cursor-pointer 
                  ${isDeletingImage ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <button
                  className="rounded-full items-center flex p-1"
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
                >
                  <Trash2 className=" text-black object-cover size-5 bg-red-400" />
                </button>
              </label>

              <img
                src={selectedImage || user?.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 cursor-pointer "
                onClick={() => setOpenFullScreenImage(true)}
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-green-400 hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  ${isUpdating ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="size-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdating}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdating
                ? "Uploading..."
                : isDeletingImage
                ? "Deleting..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{user?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>

            <dialog id="my_modal_1" className="modal">
              <div className=" flex items-center justify-center bg-gray-200 rounded-lg">
                <div className="w-full max-w-md p-6 rounded-lg bg-gray-300 shadow-md">
                  <p className="h-8 mx-10  bg-gray-400 mb-3 rounded-lg">
                    <h3 className="text-center font-semibold text-black mb-4 mx-10 py-1">
                      Delete Profile Picture?
                    </h3>
                  </p>
                  <p className="text-black">
                    This will delete the profile picture permanently.
                  </p>
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn mr-3 btn-outline text-black">
                        Close
                      </button>
                      <button
                        className="btn font-bold  btn-error"
                        type="submit"
                        onClick={handleDeleteImage}
                      >
                        Proceed
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
      {openFullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <button
            className="absolute top-5 right-5 text-white text-3xl p-2 rounded-full bg-gray-700 hover:bg-red-600 transition"
            onClick={() => setOpenFullScreenImage(false)}
          >
            <X size={32} />
          </button>

          <img
            src={selectedImage || user?.profilePic || "/avatar.png"}
            alt="Full Screen"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
