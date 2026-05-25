import React, { useState } from "react";

const EXAMPLE_QUERIES = [
    "What are the main contributions of this paper?",
    "Summarize the methodology used.",
    "What results or metrics are reported?",
    "Describe any diagrams or figures mentioned.",
];

function QueryPanel({

    status = "ready",
    apiBase = "http://localhost:8000",

}) {

    const [query, setQuery] = useState("");

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [error, setError] = useState(null);

    const [history, setHistory] = useState([]);

    const isReady = status === "ready";

    const handleQuery = async (q) => {

        const text = (q || query).trim();

        if (!text || !isReady) return;

        setLoading(true);

        setError(null);

        setResult(null);

        try {

            const res = await fetch(

                `${apiBase}/query`,

                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        query: text,
                        k: 3,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.detail || "Query failed"
                );
            }

            setResult(data);

            setHistory((prev) => [

                {
                    query: text,
                    answer: data.answer,
                },

                ...prev.slice(0, 4),

            ]);

            setQuery("");

        } catch (e) {

            setError(e.message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="flex flex-col gap-5">

            {/* Header */}

            <div className="flex items-center gap-3">

                <span
                    className="w-8 h-8 rounded-full
                    bg-blue-500/20
                    border border-blue-500/30
                    flex items-center justify-center
                    text-sm font-bold text-blue-400"
                >
                    03
                </span>

                <h2 className="text-xl font-semibold text-white">
                    Query
                </h2>

                {isReady && (

                    <span
                        className="ml-auto
                        text-xs tracking-widest
                        uppercase text-teal-400
                        animate-pulse"
                    >
                        ● Ready
                    </span>

                )}

            </div>

            {/* Placeholder */}

            {!isReady && (

                <div
                    className="flex flex-col items-center
                    justify-center text-center
                    gap-3 px-8 py-20
                    border border-dashed border-gray-700
                    rounded-2xl bg-[#111118]"
                >

                    

                    <h3 className="text-lg font-semibold text-gray-200">
                        Upload a PDF to start querying
                    </h3>

                    <p
                        className="text-sm text-gray-500
                        max-w-sm leading-relaxed"
                    >
                        The search panel activates once
                        your document is indexed.
                    </p>

                </div>

            )}

            {/* Main Query UI */}

            {isReady && (

                <>

                    {/* Example Queries */}

                    {!result && (

                        <div className="flex flex-col gap-3">

                            <p
                                className="text-xs uppercase
                                tracking-[2px] text-gray-500"
                            >
                                Example Queries
                            </p>

                            <div className="flex flex-wrap gap-3">

                                {EXAMPLE_QUERIES.map((eq) => (

                                    <button
                                        key={eq}

                                        onClick={() =>
                                            handleQuery(eq)
                                        }

                                        className="px-4 py-2
                                        rounded-full
                                        border border-gray-700
                                        bg-[#111118]
                                        text-sm text-gray-300
                                        hover:border-blue-500
                                        hover:text-blue-400
                                        transition-all"
                                    >

                                        {eq}

                                    </button>

                                ))}

                            </div>

                        </div>

                    )}

                    {/* Input */}

                    <div className="flex gap-3 items-end">

                        <textarea
                            rows={2}

                            value={query}

                            disabled={loading}

                            onChange={(e) =>
                                setQuery(e.target.value)
                            }

                            onKeyDown={(e) => {

                                if (
                                    e.key === "Enter" &&
                                    !e.shiftKey
                                ) {

                                    e.preventDefault();

                                    handleQuery();

                                }

                            }}

                            placeholder="Ask anything about the document..."

                            className="flex-1
                            bg-[#111118]
                            border border-gray-700
                            rounded-xl
                            px-4 py-3
                            text-sm text-white
                            outline-none
                            resize-none
                            focus:border-blue-500
                            transition-all"
                        />

                        <button

                            onClick={() => handleQuery()}

                            disabled={
                                loading ||
                                !query.trim()
                            }

                            className="w-12 h-12
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-500
                            disabled:opacity-40
                            flex items-center justify-center
                            text-white text-xl
                            transition-all"
                        >

                            {loading
                                ? (
                                    <div
                                        className="w-4 h-4
                                        border-2 border-white/30
                                        border-t-white
                                        rounded-full animate-spin"
                                    />
                                )
                                : "→"}

                        </button>

                    </div>

                    {/* Error */}

                    {error && (

                        <div
                            className="bg-red-500/10
                            border border-red-500/30
                            rounded-xl
                            px-4 py-3
                            text-sm text-red-400"
                        >

                            ❌ {error}

                        </div>

                    )}

                    {/* Result */}

                    {result && (

                        <div className="flex flex-col gap-5">

                            {/* Query */}

                            <div
                                className="flex gap-3
                                text-white font-medium"
                            >

                                <span
                                    className="w-6 h-6 rounded-full
                                    bg-blue-600
                                    flex items-center justify-center
                                    text-xs font-bold"
                                >
                                    ?
                                </span>

                                <p className="leading-relaxed">
                                    {result.query}
                                </p>

                            </div>

                            {/* Answer */}

                            <div
                                className="bg-[#111118]
                                border border-gray-800
                                border-l-4 border-blue-500
                                rounded-xl
                                px-5 py-4"
                            >

                                <p
                                    className="text-xs uppercase
                                    tracking-[2px]
                                    text-blue-400 mb-3"
                                >
                                    Answer
                                </p>

                                <div
                                    className="text-sm text-gray-200
                                    leading-7 whitespace-pre-wrap"
                                >
                                    {result.answer}
                                </div>

                            </div>

                            {/* Sources */}

                            {result.retrieved_chunks?.length > 0 && (

                                <div className="flex flex-col gap-4">

                                    <p
                                        className="text-xs uppercase
                                        tracking-[2px]
                                        text-gray-500"
                                    >
                                        Retrieved Sources
                                        ({result.retrieved_chunks.length})
                                    </p>

                                    <div className="flex flex-col gap-3">

                                        {result.retrieved_chunks.map((chunk) => (

                                            <div
                                                key={chunk.index}

                                                className="bg-[#111118]
                                                border border-gray-800
                                                rounded-xl
                                                p-4"
                                            >

                                                {/* Header */}

                                                <div
                                                    className="flex items-center
                                                    gap-3 mb-3"
                                                >

                                                    <span
                                                        className="text-xs
                                                        text-gray-500"
                                                    >
                                                        #{chunk.index}
                                                    </span>

                                                    <div className="flex gap-2">

                                                        {chunk.content_types?.includes("table") && (

                                                            <span
                                                                className="px-2 py-1
                                                                rounded-md
                                                                text-[10px]
                                                                bg-amber-500/10
                                                                border border-amber-500/20
                                                                text-amber-300"
                                                            >
                                                                TABLE
                                                            </span>

                                                        )}

                                                        {chunk.content_types?.includes("image") && (

                                                            <span
                                                                className="px-2 py-1
                                                                rounded-md
                                                                text-[10px]
                                                                bg-teal-500/10
                                                                border border-teal-500/20
                                                                text-teal-300"
                                                            >
                                                                IMAGE
                                                            </span>

                                                        )}

                                                    </div>

                                                </div>

                                                {/* Preview */}

                                                <p
                                                    className="text-xs
                                                    leading-6
                                                    text-gray-400"
                                                >

                                                    {chunk.preview ||
                                                        chunk.content?.slice(0, 280)}...

                                                </p>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            )}

                            {/* New Query */}

                            <button

                                onClick={() =>
                                    setResult(null)
                                }

                                className="self-start
                                px-5 py-2
                                rounded-lg
                                border border-gray-700
                                text-sm text-gray-300
                                hover:border-blue-500
                                hover:text-blue-400
                                transition-all"
                            >

                                + New Query

                            </button>

                        </div>

                    )}

                    {/* History */}

                    {history.length > 0 && !result && (

                        <div className="flex flex-col gap-3">

                            <p
                                className="text-xs uppercase
                                tracking-[2px]
                                text-gray-500"
                            >
                                Recent Queries
                            </p>

                            {history.map((item, index) => (

                                <div
                                    key={index}

                                    className="bg-[#111118]
                                    border border-gray-800
                                    rounded-xl
                                    px-4 py-3"
                                >

                                    <p
                                        className="text-sm
                                        text-gray-200
                                        font-medium mb-2"
                                    >
                                        ↪ {item.query}
                                    </p>

                                    <p
                                        className="text-xs
                                        text-gray-500
                                        leading-6"
                                    >

                                        {item.answer.slice(0, 120)}...

                                    </p>

                                </div>

                            ))}

                        </div>

                    )}

                </>

            )}

        </div>

    );
}

export default QueryPanel;