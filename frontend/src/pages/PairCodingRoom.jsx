import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { PlayIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const socket = io("https://hellofy-backend-g5ln.onrender.com");

const LANGUAGES = ["javascript", "python", "cpp", "java"];

const FILE_NAMES = {
  javascript: "main.js",
  python: "main.py",
  cpp: "main.cpp",
  java: "Main.java",
};

const randomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;

const PairCodingRoom = ({ roomId = "test-room" }) => {
  const [code, setCode] = useState("// Start coding here!");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [remoteCursors, setRemoteCursors] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const editorRef = useRef(null);
  const userColor = useRef(randomColor());
  const remoteCursorsRef = useRef({});

  // Keep remote cursor data current for Socket.IO callbacks.
  useEffect(() => {
    remoteCursorsRef.current = remoteCursors;
  }, [remoteCursors]);

  // Socket.IO collaboration
  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", roomId);

    const handleCodeUpdate = (newCode) => {
      setCode(newCode);
    };

    const handleLanguageUpdate = (newLanguage) => {
      if (LANGUAGES.includes(newLanguage)) {
        setLanguage(newLanguage);
      }
    };

    const handleCursorUpdate = ({ socketId, cursor }) => {
      const editor = editorRef.current;

      if (!editor || !cursor?.position) return;

      const existing =
        remoteCursorsRef.current[socketId]?.decorations || [];

      const decorations = editor.deltaDecorations(existing, [
        {
          range: cursor.position,
          options: {
            className: "remote-cursor",
            inlineClassName: "remote-cursor-inline",
            after: {
              content: "",
              inlineClassName: "remote-cursor-marker",
              style: `border-left: 2px solid ${cursor.color || "#ffffff"};`,
            },
          },
        },
      ]);

      setRemoteCursors((previous) => ({
        ...previous,
        [socketId]: {
          decorations,
          color: cursor.color,
        },
      }));
    };

    const handleUserDisconnected = (socketId) => {
      const editor = editorRef.current;
      const cursor = remoteCursorsRef.current[socketId];

      if (editor && cursor?.decorations) {
        editor.deltaDecorations(cursor.decorations, []);
      }

      setRemoteCursors((previous) => {
        const updated = { ...previous };
        delete updated[socketId];
        return updated;
      });
    };

    socket.on("codeUpdate", handleCodeUpdate);
    socket.on("languageUpdate", handleLanguageUpdate);
    socket.on("cursorUpdate", handleCursorUpdate);
    socket.on("userDisconnected", handleUserDisconnected);

    return () => {
      socket.off("codeUpdate", handleCodeUpdate);
      socket.off("languageUpdate", handleLanguageUpdate);
      socket.off("cursorUpdate", handleCursorUpdate);
      socket.off("userDisconnected", handleUserDisconnected);

      socket.emit("leaveRoom", roomId);
    };
  }, [roomId]);

  // Broadcast code changes
  const handleCodeChange = (value) => {
    const updatedCode = value ?? "";
    setCode(updatedCode);
    socket.emit("codeChange", {
      roomId,
      code: updatedCode,
    });
  };

  // Broadcast language changes
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;

    setLanguage(newLanguage);
    socket.emit("languageChange", {
      roomId,
      language: newLanguage,
    });
  };

  // Monaco editor initialization
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

      socket.emit("cursorChange", {
        roomId,
        cursor,
      });
    });
  };

  // Execute code using the Hellofy backend and JDoodle
  const runCode = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput("Running code...");

    try {
      const response = await axios.post(
        "https://hellofy-backend-g5ln.onrender.com/api/run-code",
        {
          language,
          files: [
            {
              name: FILE_NAMES[language],
              content: code,
            },
          ],
          stdin: "",
        },
        {
          timeout: 35000,
        }
      );

      const result = response.data?.run;

      if (!result) {
        const message =
          response.data?.message || "Unexpected execution response.";

        setOutput(message);
        toast.error(message);
        return;
      }

      const resultOutput = result.output ?? "";
      const statusCode = result.statusCode;

      setOutput(resultOutput || "Code executed with no output.");

      // JDoodle normally reports zero for a successful program exit.
      if (statusCode === 0 || statusCode === "0") {
        toast.success("Code executed successfully!");
      } else if (statusCode !== undefined && statusCode !== null) {
        toast.error("Code execution failed. Check the output.");
      } else if (resultOutput) {
        // If the provider doesn't return an exit status, avoid
        // falsely reporting a failure just because it is missing.
        toast.success("Execution completed. Check the output.");
      } else {
        toast.success("Execution completed.");
      }
    } catch (error) {
      console.error("Code execution error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const message =
        error.response?.data?.message ||
        (error.code === "ECONNABORTED"
          ? "Code execution timed out."
          : "Execution failed. Check the backend logs.");

      setOutput(message);
      toast.error(message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="select select-bordered"
            disabled={isRunning}
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
            disabled={isRunning}
          >
            <PlayIcon className="size-4" />
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>

        <Editor
          height="60vh"
          language={language === "cpp" ? "cpp" : language}
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
          }}
        />

        <div className="bg-base-300 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Output:</h3>
          <pre className="whitespace-pre-wrap break-words">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PairCodingRoom;
