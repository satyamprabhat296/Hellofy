import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { PlayIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const socket = io("http://localhost:5000");

const LANGUAGES = ["javascript", "python", "cpp", "java"];

// Random color for each user’s cursor
const randomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;

const PairCodingRoom = ({ roomId = "test-room" }) => {
  const [code, setCode] = useState("// Start coding here!");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [remoteCursors, setRemoteCursors] = useState({});
  const editorRef = useRef(null);
  const userColor = useRef(randomColor());

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("languageUpdate", (newLang) => setLanguage(newLang));

    // 👇 Receive remote cursor updates
    socket.on("cursorUpdate", ({ socketId, cursor }) => {
      if (!editorRef.current) return;
      const editor = editorRef.current;

      const existing = remoteCursors[socketId]?.decorations || [];

      const newDecorations = editor.deltaDecorations(existing, [
        {
          range: cursor.position,
          options: {
            className: "remote-cursor",
            inlineClassName: "remote-cursor-inline",
            after: {
              content: "",
              inlineClassName: "remote-cursor-marker",
              style: `border-left: 2px solid ${cursor.color};`,
            },
          },
        },
      ]);

      setRemoteCursors((prev) => ({
        ...prev,
        [socketId]: { decorations: newDecorations, color: cursor.color },
      }));
    });

    // Remove cursor when user disconnects
    socket.on("userDisconnected", (socketId) => {
      if (editorRef.current && remoteCursors[socketId]) {
        editorRef.current.deltaDecorations(
          remoteCursors[socketId].decorations,
          []
        );
      }

      setRemoteCursors((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

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

  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((event) => {
      const position = event.position;

      const cursor = {
        position: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        },
        color: userColor.current,
      };

      socket.emit("cursorChange", { roomId, cursor });
    });
  };

  const runCode = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/run-code",
        {
          language,
          version: "*",
          files: [
            {
              name: "main.js",
              content: code,
            },
          ],
        }
      );

      setOutput(res.data.run.output);
      toast.success("Code executed successfully!");
    } catch (error) {
      console.error(error);
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

          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={runCode}
          >
            <PlayIcon className="size-4" /> Run Code
          </button>
        </div>

        <Editor
          height="60vh"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorMount}
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