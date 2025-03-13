import React from "react";
import { Nav } from "react-bootstrap";
import "./Sidebar.css"; 
const Sidebar = () => {
  return (
    <aside className="sidebar d-flex flex-column bg-dark text-white vh-100 p-3 shadow-lg" >
      {/* Logo */}
      <h2 className="text-center fw-bold">DGL</h2>

      {/* Navigation Links */}
      <Nav className="flex-column mt-3">
        {["Home", "Tasks", "Team", "Documents", "Projects", "Calendar"].map((item, index) => (
          <Nav.Link
            key={index}
            href="#"
            className="text-white p-2 my-1 rounded sidebar-item"
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

export default Sidebar;
