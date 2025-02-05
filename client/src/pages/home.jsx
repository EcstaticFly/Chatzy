import { chatStore } from "../store/chatStore.js";
import Sidebar from '../components/sidebar.jsx'
import NoChatSelected from '../components/noChatSelected.jsx';
import ChatContainer from "../components/chatContainer.jsx";

export default function HomePage() {
  const {selectedUser} = chatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)] ">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar/>

            {
              !selectedUser ? (<NoChatSelected/>):(<ChatContainer/>)
            }
          </div>
        </div>
      </div>
    </div>
  )
}
