package mainPackage.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Physicians", schema = "dbo")
public class Physician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "PhysicianName", length = 50, nullable = true)
    private String physicianName;

    // Constructors
    public Physician() {
    }

    public Physician(String physicianName) {
        this.physicianName = physicianName;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPhysicianName() {
        return physicianName;
    }

    public void setPhysicianName(String physicianName) {
        this.physicianName = physicianName;
    }

    // toString
    @Override
    public String toString() {
        return "Physician{" +
                "id=" + id +
                ", physicianName='" + physicianName + '\'' +
                '}';
    }
}
