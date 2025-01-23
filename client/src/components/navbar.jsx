import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { authStore } from "../store/authStore";

function Navbar() {
    const { user, logout } = authStore();
    return (
        <header
            className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
        >
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="text-lg font-bold" />
                        </div>
                        <h1 className="text-lg font-bold">Chatzy</h1>
                    </Link>
                    </div>
                
                <div className="flex items-center gap-2">
                    <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
                        <Settings className="size-4" />
                        <span className="hidden sm:inline">Settings</span>
                    </Link>

                    {
                        user ? (
                            <>
                                <Link to="/profile" className="btn btn-sm gap-2">
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>
                                <button className="flex gap-2 items-center" onClick={logout}>
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-sm gap-2">
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Login</span>
                            </Link>
                        )
                    }
                    </div>
                </div>
            </div>
        </header>
    )

}
export default Navbar;