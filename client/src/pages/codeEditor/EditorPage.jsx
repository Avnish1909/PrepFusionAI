import React, { useEffect, useRef, useState } from "react";
import Client from "../../components/codeEditor/components/Client";
import Editor from "../../components/codeEditor/components/Editor";
import { initSocket } from "../../components/codeEditor/Socket";
import { ACTIONS } from "../../components/codeEditor/Actions";

import {
    useNavigate,
    useLocation,
    Navigate,
    useParams,
} from "react-router-dom";

import { toast } from "react-hot-toast";

import axios from "axios";

const LANGUAGES = [
    
    "cpp",
    
];

function EditorPage() {

    const [clients, setClients] = useState([]);

    const [output, setOutput] = useState("");
    const [input, setInput] = useState("");

    const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);

    const [isCompiling, setIsCompiling] = useState(false);

    const [selectedLanguage, setSelectedLanguage] = useState("python3");

    const codeRef = useRef("");

    const socketRef = useRef(null);

    const location = useLocation();

    const navigate = useNavigate();

    const { roomId } = useParams();

    useEffect(() => {

        const init = async () => {

            socketRef.current = await initSocket();

            const handleErrors = (err) => {

                console.log("Socket Error:", err);

                toast.error("Socket connection failed");

                navigate("/editor");

            };

            socketRef.current.on("connect_error", handleErrors);

            socketRef.current.on("connect_failed", handleErrors);

            socketRef.current.emit(ACTIONS.JOIN, {

                roomId,

                username: location.state?.username,

            });

            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {

                    if (username !== location.state?.username) {

                        toast.success(`${username} joined the room`);

                    }

                    setClients(clients);

                    socketRef.current.emit(ACTIONS.SYNC_CODE, {

                        socketId,

                        code: codeRef.current,

                    });

                }
            );

            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {

                    toast.success(`${username} left the room`);

                    setClients((prev) => {

                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );

                    });

                }
            );

        };

        init();

        return () => {

            if (socketRef.current) {

                socketRef.current.off(ACTIONS.JOINED);

                socketRef.current.off(ACTIONS.DISCONNECTED);

                socketRef.current.disconnect();

            }

        };

    }, []);

    if (!location.state) {

        return <Navigate to="/editor" />;

    }

    const copyRoomId = async () => {

        try {

            await navigator.clipboard.writeText(roomId);

            toast.success("Room ID copied");

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to copy Room ID");

        }

    };

    const leaveRoom = () => {

        navigate("/editor");

    };

    const runCode = async () => {

        setIsCompiling(true);

        try {

            const response = await axios.post(
                "http://localhost:5001/compile",
                {
                    code: codeRef.current,
                    input,
                }
            );

            setOutput(
                response.data.output ||
                JSON.stringify(response.data)
            );

        }

        catch (error) {

            console.log(error);

            setOutput(
                error.response?.data?.error ||
                "Compilation failed"
            );

        }

        finally {

            setIsCompiling(false);

        }

    };

return (

    <div className="min-h-screen bg-black text-white flex">

        {/* LEFT SIDEBAR */}

        <div
            className="w-[260px]
           bg-[rgb(0,0,0)]
            border-r border-white/10
            flex flex-col
            p-5"
        >

            <h1 className="text-3xl font-extrabold text-primary mb-8">
                CodeRoom
            </h1>

            <div className="flex-1 overflow-y-auto">

                <p className="text-sm text-gray-400 mb-4 border rounded-lg p-2 bg-[rgb(20,20,20)]">
                    Members
                </p>

                <div className="space-y-3 ">

                    {
                        clients.map((client) => (

                            <Client
                                key={client.socketId}
                                username={client.username}
                            />

                        ))
                    }

                </div>

            </div>

            <div className="mt-6 space-y-3">

                <button
                    onClick={copyRoomId}
                    className="w-full py-3 rounded-xl
                    bg-primary hover:opacity-90
                    transition-all font-semibold"
                >
                    Copy Room ID
                </button>

                <button
                    onClick={leaveRoom}
                    className="w-full py-3 rounded-md
                    bg-red-600 hover:bg-red-700
                    transition-all font-semibold"
                >
                    Leave Room
                </button>

            </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex-1 flex flex-col">

            {/* TOP BAR */}

            <div
                className="h-[70px]
               bg-[#161616]
                border-b border-white/10
                px-6
                flex items-center justify-between"
            >

                <h2 className="text-xl font-bold">
                    Room:
                    <span className="text-primary ml-2">
                        {roomId}
                    </span>
                </h2>

                <div className="flex items-center gap-4">

                    <select
                        value={selectedLanguage}
                        onChange={(e) =>
                            setSelectedLanguage(e.target.value)
                        }
                        className="bg-black border border-gray-700
                        rounded-md px-4 py-2 outline-none"
                    >

                        {
                            LANGUAGES.map((lang) => (

                                <option
                                    key={lang}
                                    value={lang}
                                >
                                    {lang}
                                </option>

                            ))
                        }

                    </select>

                    <button
                        onClick={() =>
                            setIsCompileWindowOpen(
                                !isCompileWindowOpen
                            )
                        }
                        className="px-5 py-2 rounded-md
                        bg-primary font-semibold"
                    >
                        {
                            isCompileWindowOpen
                                ? "Close Compiler"
                                : "Open Compiler"
                        }
                    </button>

                </div>

            </div>

            {/* EDITOR */}

            <div className="flex-1 overflow-hidden">

                {
                    socketRef.current && (

                        <Editor
                            socketRef={socketRef}
                            roomId={roomId}
                            onCodeChange={(code) => {

                                codeRef.current = code;

                            }}
                        />

                    )
                }

            </div>

            {/* COMPILER */}

            {
                isCompileWindowOpen && (

                    <div
                        className="bg-[#141414]
                        border-t border-white/10
                        p-5
                        flex flex-col
                        gap-4"
                    >

                        {/* HEADER */}

                        <div className="flex items-center justify-between">

                            <h2 className="text-lg font-bold">
                                Compiler
                            </h2>

                            <button
                                onClick={runCode}
                                disabled={isCompiling}
                                className="px-5 py-2 rounded-md
                                bg-green-600 hover:bg-green-700
                                transition-all font-semibold"
                            >
                                {
                                    isCompiling
                                        ? "Running..."
                                        : "Run Code"
                                }
                            </button>

                        </div>

                        {/* INPUT */}

                        <div>

                            <p className="mb-2 text-sm text-gray-400">
                                Input
                            </p>

                            <textarea
                                value={input}
                                onChange={(e) =>
                                    setInput(e.target.value)
                                }
                                placeholder="Enter input here..."
                                className="w-full h-[100px]
                                bg-black text-white
                                border border-gray-700
                                rounded-xl p-3
                                outline-none
                                resize-none"
                            />

                        </div>

                        {/* OUTPUT */}

                        <div>

                            <p className="mb-2 text-sm text-gray-400">
                                Output
                            </p>

                            <pre
                                className="bg-black rounded-xl p-4
                                min-h-[180px]
                                overflow-auto
                                text-sm text-green-400
                                whitespace-pre-wrap"
                            >
                                {
                                    output ||
                                    "Output will appear here..."
                                }
                            </pre>

                        </div>

                    </div>

                )
            }

        </div>

    </div>

);

}

export default EditorPage;