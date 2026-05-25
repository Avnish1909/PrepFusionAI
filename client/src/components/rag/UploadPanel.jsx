import React, { useRef, useState } from "react";

function UploadPanel({

    status = "idle",
    currentFile = "",
    onUpload,

}) {

    const inputRef = useRef(null);

    const [dragging, setDragging] = useState(false);

    const handleFile = (file) => {

        if (!file) return;

        if (!file.name.endsWith(".pdf")) {

            alert("Only PDF files are supported.");

            return;
        }

        onUpload(file);
    };

    const onDrop = (e) => {

        e.preventDefault();

        setDragging(false);

        handleFile(e.dataTransfer.files[0]);
    };

    const isDisabled = status === "processing";

    return (

        <div className="flex flex-col gap-4">

            {/* Header */}

            <div className="flex items-center gap-3">

                <span
                    className="w-8 h-8 rounded-full
                    bg-blue-500/20
                    border border-blue-500/30
                    flex items-center justify-center
                    text-sm font-bold text-blue-400"
                >
                    01
                </span>

                <h2 className="text-xl font-semibold text-white">
                    Document Ingestion
                </h2>

            </div>

            {/* Upload Zone */}

            {(status === "idle" || status === "error") && (

                <div

                    onClick={() =>
                        !isDisabled &&
                        inputRef.current.click()
                    }

                    onDragOver={(e) => {

                        e.preventDefault();

                        setDragging(true);

                    }}

                    onDragLeave={() =>
                        setDragging(false)
                    }

                    onDrop={onDrop}

                    className={`
                    border-2 border-dashed
                    rounded-2xl
                    px-8 py-14
                    text-center
                    cursor-pointer
                    transition-all duration-300
                    bg-[#111118]
                    flex flex-col items-center
                    gap-3
                    
                    ${dragging
                            ? "border-blue-500 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                            : "border-gray-700"
                        }

                    ${isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-blue-500 hover:bg-blue-500/5"
                        }
                    `}
                >

                    {/* Icon */}

                   

                    {/* Title */}

                    <h3 className="text-xl font-semibold text-white">
                        Drop PDF here
                    </h3>

                    <p className="text-gray-400">
                        or click to browse
                    </p>

                    <p
                        className="text-xs text-gray-500
                        tracking-wide mt-2"
                    >
                        Supports multi-page PDFs
                        with tables & images
                    </p>

                    {/* Hidden Input */}

                    <input
                        ref={inputRef}

                        type="file"

                        accept=".pdf"

                        hidden

                        onChange={(e) =>
                            handleFile(
                                e.target.files[0]
                            )
                        }
                    />

                </div>

            )}

            {/* File Loaded */}

            {status !== "idle" &&
                status !== "error" && (

                    <div
                        className="flex items-center gap-4
                        bg-[#111118]
                        border border-gray-800
                        rounded-2xl
                        p-5"
                    >

                        {/* Icon */}

                        

                        {/* Info */}

                        <div className="flex-1 overflow-hidden">

                            <p
                                className="text-white
                                font-medium truncate"
                            >
                                {currentFile}
                            </p>

                            {/* Status */}

                            <div
                                className={`
                                flex items-center gap-2
                                mt-2 text-sm
                                
                                ${status === "processing"
                                        ? "text-amber-400"
                                        : "text-teal-400"
                                    }
                                `}
                            >

                                {status === "processing" && (

                                    <>

                                        <div
                                            className="w-4 h-4
                                            border-2
                                            border-amber-400/30
                                            border-t-amber-400
                                            rounded-full
                                            animate-spin"
                                        />

                                        <span>
                                            Processing...
                                        </span>

                                    </>

                                )}

                                {status === "ready" && (

                                    <>
                                        ✓ Ready to query
                                    </>

                                )}

                            </div>

                        </div>

                    </div>

                )}

        </div>

    );
}

export default UploadPanel;