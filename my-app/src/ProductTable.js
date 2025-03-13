import React, { useState } from "react";
import { Table, Button, Form, InputGroup, Dropdown } from "react-bootstrap";

const ProductTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    { name: "Monstera", gross: 48.0, net: 39.02, vat: 8.98, stock: "A/22", available: 10, sold: 10, total: 294, expiry: "10-09-2019", daysLeft: 10 },
    { name: "Angelonia", gross: 32.0, net: 28.16, vat: 8.98, stock: "B/01", available: 200, sold: 200, total: 294, expiry: "12-12-2019", daysLeft: 32 },
    { name: "Begonias", gross: 16.0, net: 13.20, vat: 8.98, stock: "A/02", available: 140, sold: 140, total: 200, expiry: "12-12-2019", daysLeft: 32 },
    { name: "Sweet Potato", gross: 48.0, net: 39.02, vat: 8.98, stock: "A/22", available: 310, sold: 310, total: 320, expiry: "22-09-2019", daysLeft: 32 },
    { name: "Marigolds", gross: 32.0, net: 28.16, vat: 8.98, stock: "B/12", available: 140, sold: 154, total: 200, expiry: "01-02-2019", daysLeft: 62 },
  ];

  return (
    <div className="container mt-4">
      {/* Tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a className="nav-link active" href="#">Indoor Plant</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Outside Plant</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Flower Pots</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Fertilizers and Soil</a>
        </li>
      </ul>

      {/* Search & Filters */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <InputGroup className="w-50">
          <Form.Control
            type="text"
            placeholder="Search a product"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroup.Text>🔍</InputGroup.Text>
        </InputGroup>

        <div className="d-flex">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="light">Filter by</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Stock</Dropdown.Item>
              <Dropdown.Item>Expiry Date</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="me-2">
            <Dropdown.Toggle variant="light">Sort by</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Name</Dropdown.Item>
              <Dropdown.Item>Available Stock</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Button variant="light">⚙️</Button>
        </div>
      </div>

      {/* Table */}
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Gross</th>
            <th>Net</th>
            <th>VAT (23%)</th>
            <th>Stock</th>
            <th>Available</th>
            <th>Sold</th>
            <th>Expire Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.gross}</td>
                <td>{product.net}</td>
                <td>{product.vat}</td>
                <td>{product.stock}</td>
                <td>
                  <span className="text-danger">{product.available} pcs</span>
                  <br />
                  <small>from {product.total} pcs</small>
                </td>
                <td>
                  <span className="text-success">{product.sold} pcs</span>
                  <br />
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${(product.sold / product.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </td>
                <td>{product.expiry}</td>
                <td>
                  <Button variant="primary" size="sm" className="me-2">
                    ✏️
                  </Button>
                  <Button variant="danger" size="sm">🗑️</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* Add Product Button */}
      <div className="text-end">
        <Button variant="success">Add new product</Button>
      </div>
    </div>
  );
};

export default ProductTable;
