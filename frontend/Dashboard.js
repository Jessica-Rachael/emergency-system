import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{
      textAlign: "center",
      marginTop: "120px",
      fontFamily: "Arial"
    }}>
      
      <h1 style={{color:"#2c3e50", fontSize:"40px"}}>
        Emergency Medical ID
      </h1>

      <h3 style={{color:"#555"}}>
        Smart Emergency Information System
      </h3>

      <br/><br/>

      <Link to="/register">
        <button style={buttonStyle}>Register User</button>
      </Link>

      <br/><br/>

      <Link to="/emergency">
        <button style={buttonStyle}>Emergency Page</button>
      </Link>

    </div>
  );
}

const buttonStyle = {
  padding: "12px 30px",
  fontSize: "18px",
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

export default Dashboard;