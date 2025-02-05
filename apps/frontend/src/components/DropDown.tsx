import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Cookies from 'js-cookie';

export const UserDropdown = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px] bg-gray-800 border-gray-600">
                <DropdownMenuItem className="text-white cursor-pointer" onClick={() => window.location.href = `/profile?=${localStorage.getItem("name")}`}>
                    <a className="flex items-center gap-2">
                        <span>Profile</span>
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white cursor-pointer">
                    <button className="flex items-center gap-2 ">
                        <span>Settings</span>
                    </button>
                </DropdownMenuItem>
                <DropdownMenuItem  className="text-white cursor-pointer" onClick={() => {
                    Cookies.remove("token");
                    localStorage.removeItem("name");
                    window.location.reload();
                }}>
                    <button className="flex items-center gap-2 ">
                        <span>Sign Out</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const Avatar = () => {
    return (
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-600">
            <span className="font-medium text-white">{localStorage.getItem("name")?.slice(0, 1).toUpperCase() || "U"}</span>
        </div>
    );
};