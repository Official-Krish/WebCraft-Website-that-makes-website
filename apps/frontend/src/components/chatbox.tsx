import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

interface ChatboxProps {
  componentName: string;
  llmMessages: any;
  onClose: () => void;
  onApplyChanges: (updatedCode: string) => void;
}

export function Chatbox({ componentName, onClose, onApplyChanges, llmMessages }: ChatboxProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);

    // Send the modification request to the LLM
    const newMessage = {
      content: 'Componet Name: ' + componentName + '\n' + message,
    };
    const response = await axios.post(`${BACKEND_URL}/ai/chat`, {
      prompt: [...llmMessages, newMessage],
    });

    setLoading(false);

    // Apply the updated code
    console.log("Response:", response.data.message);
    onApplyChanges(response.data.message);
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded-lg w-80">
      <h3 className="text-lg font-semibold">Modify {componentName}</h3>
      <textarea
        className="w-full border p-2 mt-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe the change you want..."
      />
      <button onClick={handleSend} className="mt-2 bg-blue-500 text-white p-2 w-full">
        {loading ? "Processing..." : "Send"}
      </button>
      <button onClick={onClose} className="mt-2 text-gray-500 text-sm">
        Close
      </button>
    </div>
  );
}