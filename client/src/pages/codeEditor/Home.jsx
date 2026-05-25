// import React, { useState } from "react";
// import { v4 as uuid } from "uuid";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const [roomId, setRoomId] = useState("");
//   const [username, setUsername] = useState("");

//   const navigate = useNavigate();

//   const generateRoomId = (e) => {
//     e.preventDefault();
//     const Id = uuid();
//     setRoomId(Id);
//     toast.success("Room Id is generated");
//   };

//   const joinRoom = () => {
//     if (!roomId || !username) {
//       toast.error("Both the field is requried");
//       return;
//     }

//     // redirect
//     navigate(`/editor/${roomId}`, {
//       state: {
//         username,
//       },
//     });
//     toast.success("room is created");
//   };

//   // when enter then also join
//   const handleInputEnter = (e) => {
//     if (e.code === "Enter") {
//       joinRoom();
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row justify-content-center align-items-center min-vh-100">
//         <div className="col-12 col-md-6">
//           <div className="card shadow-sm p-2 mb-5 bg-secondary rounded">
//             <div className="card-body text-center bg-dark">
//               <img
//                 src="/images/codecast.png"
//                 alt="Logo"
//                 className="img-fluid mx-auto d-block"
//                 style={{ maxWidth: "150px" }}
//               />
//               <h4 className="card-title text-light mb-4">Enter the ROOM ID</h4>

//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={roomId}
//                   onChange={(e) => setRoomId(e.target.value)}
//                   className="form-control mb-2"
//                   placeholder="ROOM ID"
//                   onKeyUp={handleInputEnter}
//                 />
//               </div>
//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="form-control mb-2"
//                   placeholder="USERNAME"
//                   onKeyUp={handleInputEnter}
//                 />
//               </div>
//               <button
//                 onClick={joinRoom}
//                 className="btn btn-success btn-lg btn-block"
//               >
//                 JOIN
//               </button>
//               <p className="mt-3 text-light">
//                 Don't have a room ID? create{" "}
//                 <span
//                   onClick={generateRoomId}
//                   className=" text-success p-2"
//                   style={{ cursor: "pointer" }}
//                 >
//                   {" "}
//                   New Room
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {

    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    const generateRoomId = (e) => {

        e.preventDefault();

        const id = uuid();

        setRoomId(id);

        toast.success("Room ID Generated");

    };

    const joinRoom = () => {

        if (!roomId || !username) {

            toast.error("Both fields are required");

            return;

        }

        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });

        toast.success("Joined Room");

    };

    const handleInputEnter = (e) => {

        if (e.code === "Enter") {

            joinRoom();

        }

    };

    return (

        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

            <div
                className="w-full max-w-md
                bg-[rgb(33,31,31)]
                border border-white/10
                rounded-md
                p-10
                shadow-[0_25px_80px_rgba(0,0,0,0.7)]"
            >

                <div className="flex flex-col items-center">

                    <h1 className="text-4xl font-extrabold tracking-wide text-primary mb-2">
                        Code Editor
                    </h1>

                    <p className="text-gray-400 text-sm mb-8 text-center">
                        Join a collaborative coding room in real time
                    </p>

                </div>

                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="ROOM ID"
                    onKeyUp={handleInputEnter}
                    className="w-full p-4 rounded-md bg-black border border-gray-700
                    focus:outline-none focus:border-primary mb-5"
                />

                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="USERNAME"
                    onKeyUp={handleInputEnter}
                    className="w-full p-4 rounded-md bg-black border border-gray-700
                    focus:outline-none focus:border-primary mb-6"
                />

                <button
                    onClick={joinRoom}
                    className="w-full py-4 rounded-md bg-primary
                    hover:opacity-90 transition-all
                    text-white font-bold text-lg"
                >
                    JOIN ROOM
                </button>

                <p className="mt-6 text-center text-gray-400">

                    Don&apos;t have a room ID?

                    <span
                        onClick={generateRoomId}
                        className="text-primary ml-2 cursor-pointer hover:underline"
                    >
                        Create New Room
                    </span>

                </p>

            </div>

        </div>

    );
}

export default Home;
