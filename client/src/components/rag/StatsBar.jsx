import React from "react";

function StatsBar({

    stats = {},
    status = "idle",

}) {

    const items = [

        {
            label: "Elements",
            value: stats.total_elements,
            icon: "⬡",
        },

        {
            label: "Chunks",
            value: stats.total_chunks,
            icon: "⬡",
        },

        {
            label: "w/ Tables",
            value: stats.with_tables,
            icon: "⬡",
        },

        {
            label: "w/ Images",
            value: stats.with_images,
            icon: "⬡",
        },

    ];

    return (

        <div
            className="grid
            grid-cols-2 md:grid-cols-4
            gap-4"
        >

            {items.map((item) => (

                <div
                    key={item.label}

                    className="bg-[#111118]
                    border border-gray-800
                    rounded-2xl
                    p-5
                    text-center
                    hover:border-blue-500/40
                    transition-all duration-300"
                >

                    {/* Icon */}

                    <div
                        className="text-blue-400
                        text-lg mb-2"
                    >
                        {item.icon}
                    </div>

                    {/* Value */}

                    <div
                        className="text-3xl
                        font-bold
                        text-blue-400"
                    >

                        {item.value !== undefined

                            ? item.value

                            : status === "processing"

                                ? "…"

                                : "–"}

                    </div>

                    {/* Label */}

                    <div
                        className="mt-2
                        text-[11px]
                        uppercase tracking-[2px]
                        text-gray-500"
                    >

                        {item.label}

                    </div>

                </div>

            ))}

        </div>

    );
}

export default StatsBar;