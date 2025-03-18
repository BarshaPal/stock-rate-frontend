import React from "react";
import { Nav } from "react-bootstrap";
import "./Sidebar.css";

const LightSidebar = () => {
  return (
    <aside
      className="sidebar d-flex flex-column vh-100 p-3 shadow-sm"
      style={{
        backgroundColor: "#ffffff",       // white background
        color: "#212529",
        width: "240px",                   // increased width
        fontSize: "14px",                 // slightly larger font
        fontFamily: "sans-serif",
        borderRight: "1px solid #dee2e6"  // light grey right border
      }}
    >
      {/* Logo */}
      <h4 className="text-center fw-bold mb-4">DGL</h4>

      {/* Navigation Links */}
      <Nav className="flex-column">
        {["Home", "Tasks", "Team", "Documents", "Projects", "Calendar"].map((item, index) => (
          <Nav.Link
            key={index}
            href="#"
            className="text-dark px-2 py-2 my-1 rounded sidebar-item"
          >
            {item}
          </Nav.Link>
        ))}
      </Nav>

      {/* Footer */}
      <div className="mt-auto text-center fw-bold border-top pt-3">Settings</div>
    </aside>
  );
};

export default LightSidebar;
