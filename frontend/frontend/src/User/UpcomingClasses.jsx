import React, { useState } from "react";
import UserNavbar from "./UserNavbar";
import "./UpcomingClasses.css";

function UpcomingClasses() {

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const classes = [
    {
      id: 1,
      course: "React JS",
      date: "28 June 2026",
      time: "7:00 PM",
    },
    {
      id: 2,
      course: "Node JS",
      date: "1 July 2026",
      time: "6:30 PM",
    },
  ];

  return (
    <div className="app-layout">

      <UserNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className={`upcoming-page ${
          !sidebarOpen ? "expanded" : ""
        }`}
      >

        <h1>Upcoming Classes</h1>

        {classes.map((item) => (

          <div
            className="class-card"
            key={item.id}
          >

            <h3>{item.course}</h3>

            <p>Date : {item.date}</p>

            <p>Time : {item.time}</p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default UpcomingClasses;