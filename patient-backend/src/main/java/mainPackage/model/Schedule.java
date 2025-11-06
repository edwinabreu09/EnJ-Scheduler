package mainPackage.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "Schedule")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String day;

    private LocalTime time;

    @ManyToOne
    @JoinColumn(name = "PatientID")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "PhysicianID")
    private Physician physician;

    // Constructors
    public Schedule() {}

    public Schedule(String day, LocalTime time, Patient patient, Physician physician) {
        this.day = day;
        this.time = time;
        this.patient = patient;
        this.physician = physician;
    }

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Physician getPhysician() { return physician; }
    public void setPhysician(Physician physician) { this.physician = physician; }
}
