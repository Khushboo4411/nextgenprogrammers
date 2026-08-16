import React from "react";
import UserNavbar from "./UserNavbar";
import { useState } from "react";
import "./Assignments.css";

function Assignments() {

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const assignments = [
    {
      id: 1,
      title: "React Components",
      due: "30 June 2026",
      status: "Pending",
    },
    {
      id: 2,
      title: "Node API Project",
      due: "5 July 2026",
      status: "Submitted",
    },
  ];

  return (
    <div className="app-layout">

      <UserNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`assignment-page ${
          !sidebarOpen ? "expanded" : ""
        }`}
      >

        <h1>Assignments</h1>

        {assignments.map((item) => (

          <div
            className="assignment-card"
            key={item.id}
          >

            <h3>{item.title}</h3>

            <p>
              Due Date : {item.due}
            </p>

            <span>{item.status}</span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Assignments;