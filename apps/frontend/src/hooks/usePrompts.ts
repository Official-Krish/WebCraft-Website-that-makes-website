import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Prompt {
    id: string;
    content: string;
    type: "USER"| "SYSTEM";
    createdAt: Date;
    actions: Action[]
}

interface Action {
    id: string;
    createdAt: Date;
    content: string;
}

export const usePrompts = (projectId: string) => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const token = Cookies.get("token");

    useEffect(() => {
        async function fetchPrompts() {
            const res = await axios.get(`${BACKEND_URL}/project/${projectId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setPrompts(res.data.prompts);
        }
        let interval = setInterval(fetchPrompts, 3000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    return prompts;
}