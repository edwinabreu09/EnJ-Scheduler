import { useEffect, useState } from "react";

function App() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [assignedPhysicians, setAssignedPhysicians] = useState({});
  const [schedule, setSchedule] = useState({});
  const [confirmRemove, setConfirmRemove] = useState(null);

  const physicians = [
    "Dr. Smith","Dr. Johnson","Dr. Williams","Dr. Brown","Dr. Jones",
    "Dr. Garcia","Dr. Miller","Dr. Davis","Dr. Rodriguez","Dr. Martinez",
    "Dr. Hernandez","Dr. Lopez","Dr. Gonzalez","Dr. Wilson","Dr. Anderson",
    "Dr. Thomas","Dr. Taylor","Dr. Moore","Dr. Jackson","Dr. Martin"
  ];

  const generateTimeSlots = () => {
    const slots = [];
    let hour = 7;
    let min = 0;
    while (hour < 19 || (hour === 19 && min === 0)) {
      slots.push(`${hour.toString().padStart(2,"0")}:${min.toString().padStart(2,"0")}`);
      min += 30;
      if (min === 60) { min = 0; hour += 1; }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  useEffect(() => {
    fetch("http://localhost:8080/patients")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setFilteredPatients(data);
      })
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  const handleSearch = () => {
    if (firstName.trim().length < 3 && lastName.trim().length < 3) {
      setError("Please enter at least 3 characters in either field.");
      return;
    }
    setError("");

    const filtered = patients.filter((p) => {
      const nameLower = p.name.toLowerCase();
      const firstLower = firstName.trim().toLowerCase();
      const lastLower = lastName.trim().toLowerCase();
      if (firstLower && lastLower) return nameLower.includes(firstLower) && nameLower.includes(lastLower);
      if (firstLower) return nameLower.includes(firstLower);
      if (lastLower) return nameLower.includes(lastLower);
      return false;
    });

    setFilteredPatients(filtered);
  };

  const handlePatientClick = (id) => {
    setSelectedPatientId(id === selectedPatientId ? null : id);
  };

  const handlePhysicianChange = (patientId, physician) => {
    setAssignedPhysicians({ ...assignedPhysicians, [patientId]: physician });

    if (!schedule[physician]) {
      const newSchedule = {};
      days.forEach(day => timeSlots.forEach(time => newSchedule[`${day}-${time}`] = null));
      setSchedule(prev => ({ ...prev, [physician]: newSchedule }));
    }
  };

  const handleSlotToggle = (physician, day, time) => {
    if (!selectedPatientId) return;

    const key = `${day}-${time}`;
    const currentPatientName = patients.find(p => p.id === selectedPatientId)?.name;
    const currentCell = schedule[physician]?.[key];

    if (currentCell) {
      // Only show popup if cell already assigned
      setConfirmRemove({ physician, day, time });
      return;
    }

    // Otherwise assign patient
    setSchedule(prev => ({
      ...prev,
      [physician]: {
        ...prev[physician],
        [key]: currentPatientName
      }
    }));
  };

  const confirmRemoveYes = () => {
    if (!confirmRemove) return;
    const { physician, day, time } = confirmRemove;
    const key = `${day}-${time}`;
    setSchedule(prev => ({
      ...prev,
      [physician]: {
        ...prev[physician],
        [key]: null
      }
    }));
    setConfirmRemove(null);
  };

  const confirmRemoveNo = () => setConfirmRemove(null);

  const isButtonDisabled = firstName.trim().length < 3 && lastName.trim().length < 3;
  const selectedPhysician = selectedPatientId ? assignedPhysicians[selectedPatientId] : null;

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #001F3F, #003366)", // Dark blue background
        color: "white"
      }}
    >
      {/* Top header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "normal" }}>Patient Lookup & Schedule</h2>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#00BFFF" }}>
          EIJ Scheduler
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
        {/* Left panel: Patient list */}
        <div style={{ flex: 1, maxHeight: "85vh", overflowY: "auto" }}>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text" placeholder="First Name" value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="text" placeholder="Last Name" value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={handleSearch} disabled={isButtonDisabled} style={{ padding: "6px 12px" }}>Go</button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {filteredPatients.length === 0 ? <p>No matching patients found.</p> :
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {filteredPatients.map(patient => (
                <li key={patient.id} style={{
                  marginBottom: "10px",
                  cursor: "pointer",
                  backgroundColor: selectedPatientId === patient.id ? "#224" : "transparent",
                  padding: "5px",
                  borderRadius: "4px"
                }}>
                  <span
                    onClick={() => handlePatientClick(patient.id)}
                    style={{
                      fontWeight: selectedPatientId === patient.id ? "bold" : "normal",
                      color: selectedPatientId === patient.id ? "#00BFFF" : "white"
                    }}
                  >
                    {patient.id}: {patient.name}
                  </span>
                  {selectedPatientId === patient.id && (
                    <select
                      style={{ marginLeft: "10px", padding: "4px" }}
                      value={assignedPhysicians[patient.id] || ""}
                      onChange={(e) => handlePhysicianChange(patient.id, e.target.value)}
                    >
                      <option value="">Select Physician</option>
                      {physicians.map((doc, idx) => <option key={idx} value={doc}>{doc}</option>)}
                    </select>
                  )}
                </li>
              ))}
            </ul>
          }
        </div>

        {/* Right panel: Schedule */}
        {selectedPhysician && (
          <div style={{ flex: 2, overflowX: "auto" }}>
            <h2>Schedule for {selectedPhysician}</h2>
            <table style={{ borderCollapse: "collapse", width: "100%", textAlign: "center", backgroundColor: "#001a33" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ccc", padding: "5px", width: "60px" }}>Time</th>
                  {days.map(day => (
                    <th key={day} style={{ border: "1px solid #ccc", padding: "5px" }}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time}>
                    <td style={{ border: "1px solid #ccc", padding: "5px", width: "60px" }}>{time}</td>
                    {days.map(day => {
                      const key = `${day}-${time}`;
                      const cellPatient = schedule[selectedPhysician]?.[key];
                      const isBooked = Boolean(cellPatient);

                      return (
                        <td
                          key={key}
                          style={{
                            border: "1px solid #ccc",
                            padding: "5px",
                            backgroundColor: isBooked ? "#555" : "#228B22", // darker green
                            position: "relative",
                            height: "40px",
                            width: "120px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (isBooked) {
                              setConfirmRemove({ physician: selectedPhysician, day, time });
                            }
                          }}
                        >
                          {!isBooked ? (
                            <input
                              type="checkbox"
                              onChange={() => handleSlotToggle(selectedPhysician, day, time)}
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                cursor: "pointer"
                              }}
                            />
                          ) : (
                            <span
                              style={{
                                color: "white",
                                fontWeight: "bold",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                whiteSpace: "nowrap",
                                textShadow: "1px 1px 2px black",
                              }}
                            >
                              {cellPatient}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Centered confirmation popup */}
      {confirmRemove && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.9)",
            padding: "30px",
            borderRadius: "10px",
            zIndex: 1000,
            color: "white",
            textAlign: "center"
          }}
        >
          <p>Would you like to remove this patient from this timeslot?</p>
          <button onClick={confirmRemoveYes} style={{ margin: "5px", padding: "6px 12px" }}>Yes</button>
          <button onClick={confirmRemoveNo} style={{ margin: "5px", padding: "6px 12px" }}>No</button>
        </div>
      )}
    </div>
  );
}

export default App;
