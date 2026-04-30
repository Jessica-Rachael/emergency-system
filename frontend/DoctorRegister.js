import { useState } from "react";

function DoctorRegister() {
  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    hospital: "",
    license: "",
    proof: null,
    password: ""   // ✅ added
  });

  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleFile = (e) => {
    setDoctor({ ...doctor, proof: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const doctorData = {
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      license: doctor.license,
      password: doctor.password   // ✅ added
    };

    try {
      const response = await fetch("http://localhost:5000/register-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData)
      });

      const data = await response.json();

      if (response.ok) {
        setDoctorId(data.doctor_id);
        alert("Doctor registered successfully!"); // ✅ success msg

        setDoctor({
          name: "",
          specialization: "",
          hospital: "",
          license: "",
          proof: null,
          password: ""
        });
      } else {
        alert(data.message || "Registration failed");
      }

    } catch (error) {
      alert("Error registering doctor");
    }

    setLoading(false);
  };

  return (
    <div className="page-content">
      <div className="page-inner">

        <div className="banner blue">
          <span>📌</span>
          A valid <strong>&nbsp;medical license number&nbsp;</strong> is required. After registration
          you will receive a unique <strong>&nbsp;Doctor ID&nbsp;</strong> for login.
        </div>

        <div className="two-col">

          {/* LEFT — Form */}
          <div>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-head">
                <div className="card-icon blue">👨‍⚕️</div>
                <div>
                  <div className="card-title">Doctor Registration Form</div>
                  <div className="card-sub">Submit your credentials to receive a unique Doctor ID</div>
                </div>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" type="text" name="name"
                        value={doctor.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Specialization *</label>
                      <input className="form-input" type="text" name="specialization"
                        value={doctor.specialization} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Hospital *</label>
                      <input className="form-input" type="text" name="hospital"
                        value={doctor.hospital} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                      <label className="form-label">License *</label>
                      <input className="form-input" type="text" name="license"
                        value={doctor.license} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Upload License *</label>
                    <input className="form-input" type="file"
                      onChange={handleFile} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      className="form-input"
                      type="password"
                      name="password"
                      value={doctor.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="btn-row">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Registering..." : "Register as Doctor"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() =>
                        setDoctor({
                          name: "",
                          specialization: "",
                          hospital: "",
                          license: "",
                          proof: null,
                          password: ""
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>

          {/* RIGHT — Success */}
          <div>
            {doctorId && (
              <div className="qr-success">
                <div>✅ Doctor Registered Successfully!</div>
                <div style={{ marginTop: 10, fontWeight: "bold" }}>
                  Doctor ID: {doctorId}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default DoctorRegister;