import { useEffect, useState } from "react";
import { chatStore } from "../store/chatStore.js";
import SidebarSkeleton from "./skeletons/sidebarSkeleton.jsx";
import { Users } from "lucide-react";
import { authStore } from "../store/authStore.js";
import { Search, X } from "lucide-react";
import { toast } from "react-toastify";
import SearchSkeleton from "./skeletons/searchSkeleton.jsx";

const chatBotId = "67a5af796174659ba813c735";

export default function Sidebar() {
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [query, setQuery] = useState("");
  const {
    users,
    getUsers,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getSearchResults,
    searchResults,
    resetSearchResults,
    isSearchingUser,
  } = chatStore();

  const { onlineUsers } = authStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filterOnlineUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (query.trim().length > 0) {
      await getSearchResults(query);
    } else {
      toast.warning("Atleast one character needed", {
        position: "bottom-right",
      });
    }
  };

  // console.log(searchResults, "search");

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex flex-col lg:flex-row items-center gap-2 justify-between">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
          <button
            onClick={() => setIsSearchBoxOpen(true)}
            className="flex items-center gap-2 px-2 py-2 rounded-lg shadow-sm hover:bg-secondary"
          >
            <Search className="size-5" />
          </button>
        </div>
        <div className="mt-3 flex flex-col lg:flex-row items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(event) => setShowOnlineOnly(event.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm hidden lg:flex">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500 hidden lg:flex">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {filterOnlineUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {(onlineUsers.includes(user._id) || user._id === chatBotId) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id)
                  ? "Online"
                  : user._id === chatBotId
                  ? "Online"
                  : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filterOnlineUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
      {isSearchBoxOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          <div
            className="absolute inset-0 "
            onClick={() => {
              setIsSearchBoxOpen(false);
              resetSearchResults();
              setQuery("");
            }}
          />

          <div className="relative w-96 h-full shadow-xl p-4 flex flex-col bg-primary bg-opacity-100">
            <form onSubmit={handleSubmit}>
              <button
                type="button"
                onClick={() => {
                  setIsSearchBoxOpen(false);
                  setQuery("");
                  resetSearchResults();
                }}
                className="absolute top-5 right-5 p-2 rounded-full"
              >
                <X className="size-5" />
              </button>
              <button type="submit" className="absolute top-5 p-2 rounded-full">
                <Search className="size-5" />
              </button>
              <input
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
              />
            </form>
            {isSearchingUser ? <SearchSkeleton /> : null}

            <div className="flex-1 overflow-auto mt-4">
              {searchResults && searchResults.length > 0 ? (
                <div className="w-70 p-4 border rounded-lg shadow">
                  {searchResults.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 p-4 border-b-2 last:border-none hover:cursor-pointer"
                      onClick={() => {
                        setSelectedUser(item);
                        setIsSearchBoxOpen(false);
                      }}
                    >
                      <img
                        src={item.profilePic || "/avatar.png"}
                        alt={item.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.fullName}</div>
                        <div className={`text-sm`}>
                          {onlineUsers.includes(item._id)
                            ? "Online"
                            : "Offline"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center rounded-lg bg-opacity-100 py-4 flex items-center justify-center">
                  <div className=" bg-secondary text-white rounded-lg w-64 text-center">
                    No users found
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
