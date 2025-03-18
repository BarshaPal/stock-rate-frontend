import React, { useState } from 'react';
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from 'reactstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar
      color="light"
      light
      expand="md"
      className="fixed-top"
      style={{
        backgroundColor: "#e9ecef",               // light grey
        borderBottom: "1px solid #ccc",           // thin grey border
        zIndex: 1030,
        paddingTop: "0.3rem",                     // thinner height
        paddingBottom: "0.3rem"
      }}
    >
      <NavbarBrand tag={Link} to="/" style={{ fontSize: "1rem" }}>STOCK exchange</NavbarBrand>
      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="justify-content-end" style={{ width: "100%" }} navbar>
          <NavItem>
            <NavLink href="https://twitter.com/oktadev" style={{ fontSize: "0.9rem" }}>Profile</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="https://github.com/oktadev/okta-spring-boot-react-crud-example" style={{ fontSize: "0.9rem" }}>Logout</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default AppNavbar;
