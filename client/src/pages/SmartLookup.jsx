import React, { useState } from "react";
import axios from "axios";

import UploadPanel from "../components/rag/UploadPanel.jsx";
import QueryPanel from "../components/rag/QueryPanel.jsx";
import StatsBar from "../components/rag/StatsBar.jsx";
import PipelineVisualizer from "../components/rag/PipelineVisualizer.jsx";

function SmartLookup() {

    const [status, setStatus] = useState("idle");

    const [stats, setStats] = useState({});

    const [currentFile, setCurrentFile] = useState("");

    const [progress, setProgress] = useState([]);

    // Upload Handler

    const handleUpload = async (file) => {

        try {

            setStatus("processing");

            setProgress([
                "Uploading PDF...",
            ]);

            const formData = new FormData();

            formData.append("file", file);

            const res = await axios.post(

                `${import.meta.env.VITE_RAG_URL}/upload`,

                formData,

                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }

            );

            setCurrentFile(res.data.filename);

            setStats(res.data.stats || {});

            setProgress([
                "PDF uploaded",
                "Chunking completed",
                "Embeddings created",
                "Ready for querying",
            ]);

            setStatus("ready");

        } catch (err) {

            console.log(err);

            setStatus("error");

            setProgress([
                " Upload failed",
            ]);

        }

    };

    return (

        <div className="min-h-screen bg-[#0a0a0f] text-white">

            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Heading */}

                <div className="mb-12">

                    <h1 className="text-5xl font-bold mb-4">
                        Smart Lookup
                    </h1>

                    <p className="text-gray-400 text-lg">
                        Upload PDFs and chat with your documents using AI.
                    </p>

                </div>

                {/* Stats */}

                <StatsBar
                    stats={stats}
                    status={status}
                />

                {/* Panels */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

                    <UploadPanel
                        status={status}
                        currentFile={currentFile}
                        onUpload={handleUpload}
                    />

                    <QueryPanel
                        status={status}
                        apiBase="http://localhost:8000"
                    />

                </div>

                {/* Pipeline */}

                <div className="mt-16">

                    <PipelineVisualizer
                        status={status}
                        progress={progress}
                    />

                </div>

            </div>

        </div>

    );
}

export default SmartLookup;