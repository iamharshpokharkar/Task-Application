// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../styles/global.css";
// const Dashboard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filter, setFilter] = useState("all");

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dueDate, setDueDate] = useState("");

//   const token = localStorage.getItem("token");

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/tasks", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setTasks(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // decode user id
//   const userId = JSON.parse(atob(token.split(".")[1])).id;

//   // filter logic
//   const filteredTasks = tasks.filter((task) => {
//     if (filter === "my") return task.creator?._id === userId;
//     if (filter === "assigned") return task.assignedTo?._id === userId;
//     return true;
//   });

//   // CREATE TASK
//   const createTask = async () => {
//     try {
//       await axios.post(
//         "http://localhost:5000/api/tasks",
//         {
//           title,
//           description,
//           dueDate,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setTitle("");
//       setDescription("");
//       setDueDate("");

//       fetchTasks();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Dashboard</h2>

//       {/* ✅ CREATE TASK FORM */}
//       <h3>Create Task</h3>

//       <input
//         type="text"
//         placeholder="Enter title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <br /><br />

//       <input
//         type="text"
//         placeholder="Enter description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />

//       <br /><br />

//       <input
//         type="date"
//         value={dueDate}
//         onChange={(e) => setDueDate(e.target.value)}
//       />

//       <br /><br />

//       <button onClick={createTask}>Create Task</button>

//       <hr />

//       {/* ✅ FILTER BUTTONS */}
//       <button onClick={() => setFilter("all")}>All Tasks</button>
//       <button onClick={() => setFilter("my")}>My Tasks</button>
//       <button onClick={() => setFilter("assigned")}>Assigned Tasks</button>

//       <hr />

//       {/* ✅ TASK LIST */}
//       {filteredTasks.map((task) => (
//         <div
//           key={task._id}
//           style={{
//             border: "1px solid black",
//             margin: "10px",
//             padding: "10px",
//           }}
//         >
//           <h3>{task.title}</h3>
//           <p>{task.description}</p>

//           <p><b>Status:</b> {task.status}</p>

//           <p>
//             <b>Due:</b>{" "}
//             {task.dueDate
//               ? new Date(task.dueDate).toLocaleDateString()
//               : "N/A"}
//           </p>

//           <p><b>Creator:</b> {task.creator?.name}</p>
//           <p><b>Assigned:</b> {task.assignedTo?.name || "None"}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/global.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");
  const userId = JSON.parse(atob(token.split(".")[1])).id;

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "my") return task.creator?._id === userId;
    if (filter === "assigned") return task.assignedTo?._id === userId;
    return true;
  });

  const createTask = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title, description, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setDescription("");
      setDueDate("");
      setShowModal(false);

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>TaskFlow</h2>

        <button onClick={() => setFilter("all")}>📋 All Tasks</button>
        <button onClick={() => setFilter("my")}>👤 My Tasks</button>
        <button onClick={() => setFilter("assigned")}>📌 Assigned</button>

        
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <h2>Dashboard</h2>

          <button className="primary" onClick={() => setShowModal(true)}>
            + Create Task
          </button>
        </div>

        {/* TASK GRID */}
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <div className="task-card" key={task._id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              <span className={`status ${task.status}`}>
                {task.status}
              </span>

              <p>📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</p>
              <p>👤 {task.creator?.name}</p>
              <p>📌 {task.assignedTo?.name || "None"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Task</h3>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <div className="modal-actions">
              <button className="primary" onClick={createTask}>
                Create
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;