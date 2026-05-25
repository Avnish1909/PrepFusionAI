import React, { useEffect, useRef } from "react";

const STAGES = [
    {
        id: "partition",
        label: "Partition",
        icon: "",
        desc: "Unstructured extracts text, tables & images from PDF",
        keywords: ["Partitioning", "Extracted", "elements"],
    },
    {
        id: "chunk",
        label: "Chunk",
        icon: "",
        desc: "chunk_by_title splits content into semantic chunks",
        keywords: ["Chunking", "chunks"],
    },
    {
        id: "enrich",
        label: "Enrich",
        icon: "",
        desc: "GPT-4o summarises mixed table/image chunks",
        keywords: ["Processing", "AI summary", "Processed"],
    },
    {
        id: "embed",
        label: "Embed",
        icon: "",
        desc: "OpenAI embeddings stored in ChromaDB",
        keywords: ["embeddings", "ChromaDB", "Vector store", "completed"],
    },
];

function detectStage(progress) {

    if (!progress?.length) return -1;

    const joined = progress.join(" ");

    let detected = -1;

    STAGES.forEach((stage, index) => {

        if (
            stage.keywords.some((keyword) =>
                joined.includes(keyword)
            )
        ) {
            detected = index;
        }

    });

    return detected;
}

function PipelineVisualizer({

    status = "idle",
    progress = [],

}) {

    const logRef = useRef(null);

    useEffect(() => {

        if (logRef.current) {

            logRef.current.scrollTop =
                logRef.current.scrollHeight;

        }

    }, [progress]);

    const activeStage = detectStage(progress);

    const isDone = status === "ready";

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
                    02
                </span>

                <h2 className="text-xl font-semibold text-white">
                    Pipeline
                </h2>

            </div>

            {/* Stage Track */}

            <div
                className="flex items-center
                bg-[#111118]
                border border-gray-800
                rounded-2xl
                px-4 py-8
                overflow-x-auto"
            >

                {STAGES.map((stage, index) => {

                    const isActive =
                        activeStage === index && !isDone;

                    const isDoneStage =
                        isDone || activeStage > index;

                    return (

                        <React.Fragment key={stage.id}>

                            {/* Node */}

                            <div
                                className="flex flex-col
                                items-center relative
                                min-w-[80px]"
                            >

                                {/* Pulse */}

                                {isActive && (

                                    <div
                                        className="absolute
                                        w-14 h-14
                                        rounded-full
                                        border-2 border-amber-400
                                        animate-ping"
                                    />

                                )}

                                {/* Circle */}

                                <div
                                    className={`
                                    relative z-10
                                    w-12 h-12 rounded-full
                                    flex items-center justify-center
                                    border-2 transition-all duration-300
                                    
                                    ${isDoneStage
                                            ? "bg-teal-500/20 border-teal-400 text-teal-400"
                                            : isActive
                                                ? "bg-amber-500/10 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)]"
                                                : "bg-[#0a0a0f] border-gray-700 text-gray-400"
                                        }
                                    `}
                                >

                                    {isDoneStage
                                        ? "✓"
                                        : stage.icon}

                                </div>

                                {/* Label */}

                                <p
                                    className={`
                                    mt-3 text-xs font-medium uppercase tracking-wider
                                    
                                    ${isDoneStage
                                            ? "text-teal-400"
                                            : isActive
                                                ? "text-amber-300"
                                                : "text-gray-500"
                                        }
                                    `}
                                >

                                    {stage.label}

                                </p>

                            </div>

                            {/* Connector */}

                            {index < STAGES.length - 1 && (

                                <div
                                    className={`
                                    flex-1 h-[2px] mb-6 transition-all duration-500
                                    
                                    ${activeStage > index || isDone
                                            ? "bg-teal-400"
                                            : "bg-gray-700"
                                        }
                                    `}
                                />

                            )}

                        </React.Fragment>

                    );

                })}

            </div>

            {/* Description */}

            {activeStage >= 0 && !isDone && (

                <div
                    className="bg-[#111118]
                    border border-gray-800
                    border-l-4 border-amber-400
                    rounded-xl
                    px-4 py-3
                    text-sm text-gray-300"
                >

                    {STAGES[activeStage]?.desc}

                </div>

            )}

            {isDone && (

                <div
                    className="bg-[#111118]
                    border border-gray-800
                    border-l-4 border-teal-400
                    rounded-xl
                    px-4 py-3
                    text-sm text-teal-400"
                >

                    🎉 Pipeline complete — ready to query

                </div>

            )}

            {/* Logs */}

            {progress?.length > 0 && (

                <div
                    ref={logRef}

                    className="bg-[#0f0f14]
                    border border-gray-800
                    rounded-2xl
                    p-4
                    max-h-[240px]
                    overflow-y-auto
                    flex flex-col gap-2
                    font-mono text-xs"
                >

                    {progress.map((line, index) => (

                        <div
                            key={index}

                            className={`
                            leading-relaxed
                            
                            ${line.startsWith("❌")
                                    ? "text-red-400"
                                    : line.startsWith("✅") ||
                                        line.startsWith("🎉")
                                        ? "text-teal-400"
                                        : "text-gray-400"
                                }
                            `}
                        >

                            {line}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default PipelineVisualizer;