import { useNavigate } from "react-router-dom";
import Logo from '../assets/Logo.png';

export const Appbar2 = () => {
    const navigate = useNavigate();
    return <div className="bg-brown3 flex justify-around items-center p-3 shadow-lg border-b-2 border-brown2">
        <div className="flex">
            <img src={Logo} className="h-12 w-auto rounded-full pr-2" />
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-3xl font-bold text-transparent bg-clip-text" onClick={() => navigate("/home")}
                >
                Pixlr
            </button>
        </div>
        <div className="flex justify-between text-gray-400 text-md font-medium space-x-10">
            <button className="hover:underline hover:text-gray-200">About</button>
            <button className="hover:underline hover:text-gray-200">How it Works</button>
            <button className="hover:underline hover:text-gray-200">Showcase</button>
            <button className="hover:underline hover:text-gray-200">Pricing</button>
        </div>

        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg">
            Get Started
        </button>
    </div>
}