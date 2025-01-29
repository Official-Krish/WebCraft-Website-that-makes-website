import { useState } from 'react';

interface ChatboxProps {
  componentName: string;
  onClose: () => void;
  handleComponentEdit: any;
}

export function Chatbox({ componentName, onClose, handleComponentEdit }: ChatboxProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded-lg w-80">
      <h3 className="text-lg font-semibold">Modify {componentName}</h3>
      <textarea
        className="w-full border p-2 mt-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe the change you want..."
      />
      <button onClick={async () => {
            setLoading(true);
            await handleComponentEdit;
            setLoading(false);
        }} className="mt-2 bg-blue-500 text-white p-2 w-full">
        {loading ? "Processing..." : "Send"}
      </button>
      <button onClick={onClose} className="mt-2 text-gray-500 text-sm">
        Close
      </button>
    </div>
  );
}
