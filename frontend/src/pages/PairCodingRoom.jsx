import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { PlayIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const socket = io("http://localhost:5000");

const LANGUAGES = ["javascript", "python", "cpp", "java"];

const PairCodingRoom = ({ roomId = "test-room" }) => {
  const [code, setCode] = useState("// Start coding here!");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("languageUpdate", (newLang) => setLanguage(newLang));

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit("codeChange", { roomId, code: value });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit("languageChange", { roomId, language: newLang });
  };

  const runCode = async () => {
    try {
      const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language,
        version: "*",
        files: [{ content: code }],
      });
      setOutput(res.data.run.output);
      toast.success("Code executed successfully!");
    } catch (error) {
      setOutput("Error executing code");
      toast.error("Failed to run code");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="select select-bordered"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <button className="btn btn-primary flex items-center gap-2" onClick={runCode}>
            <PlayIcon className="size-4" /> Run Code
          </button>
        </div>

        <Editor
          height="60vh"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
        />

        <div className="bg-base-300 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Output:</h3>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default PairCodingRoom;
