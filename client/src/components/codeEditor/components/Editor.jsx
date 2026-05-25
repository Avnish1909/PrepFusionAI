import React, { useEffect, useRef } from "react";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";

import "codemirror/mode/javascript/javascript";

import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

import CodeMirror from "codemirror";
import "codemirror/theme/material.css";

import { ACTIONS } from "../Actions";

function Editor({ socketRef, roomId, onCodeChange }) {

    const editorRef = useRef(null);

    useEffect(() => {

        const editor = CodeMirror.fromTextArea(

            document.getElementById("realtimeEditor"),

            {
                mode: "javascript",

                theme: "dracula",

                autoCloseTags: true,

                autoCloseBrackets: true,

                lineNumbers: true,

                lineWrapping: true,
            }
        );

        editorRef.current = editor;

        editor.setSize("100%", "100%");

        editor.on("change", (instance, changes) => {

            const { origin } = changes;

            const code = instance.getValue();

            onCodeChange(code);

            if (origin !== "setValue") {

                socketRef.current?.emit(
                    ACTIONS.CODE_CHANGE,
                    {
                        roomId,
                        code,
                    }
                );

            }

        });

        return () => {

            if (editorRef.current) {

                editorRef.current.toTextArea();

            }

        };

    }, []);

useEffect(() => {

    const socket = socketRef.current;

    if (!socket) return;

    const handleCodeChange = ({ code }) => {

        if (
            code !== null &&
            editorRef.current
        ) {

            const currentCode =
                editorRef.current.getValue();

            if (currentCode !== code) {

                editorRef.current.setValue(code);

            }

        }

    };

    socket.on(
        ACTIONS.CODE_CHANGE,
        handleCodeChange
    );

    return () => {

        socket.off(
            ACTIONS.CODE_CHANGE,
            handleCodeChange
        );

    };

}, [socketRef.current]);

    return (

        <div className="h-full w-full">

            <textarea id="realtimeEditor"></textarea>

        </div>

    );

}

export default Editor;