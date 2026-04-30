import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function PatientDashboard() {
  const { id } = useParams();   // ✅ get ID from URL
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/patient/${id}`)
      .then(res => setPatient(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!patient) return <h2>Loading...</h2>;

  return (
    <div className="page-content">
      <div className="page-inner">

        <h2>🧑‍⚕️ Patient Dashboard</h2>

        <div className="card">
          <div className="card-body">

            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Blood Group:</strong> {patient.blood_group}</p>
            <p><strong>Allergies:</strong> {patient.allergies}</p>

          </div>
        </div>

        <div className="card">
          <div className="card-body">

            <h3>📱 Your QR Code</h3>

            <img
              src={`http://localhost:5000/qrcode/${id}`}
              alt="QR Code"
              style={{ width: "200px" }}
            />

            <br /><br />

            <a
              href={`http://localhost:5000/qrcode/${id}`}
              download
              className="btn btn-primary"
            >
              ⬇ Download QR
            </a>

          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientDashboard;