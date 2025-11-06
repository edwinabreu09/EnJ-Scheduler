package mainPackage.controller;

import mainPackage.model.Schedule;
import mainPackage.model.Patient;
import mainPackage.model.Physician;
import mainPackage.dao.ScheduleRepository;
import mainPackage.dao.PatientRepository;
import mainPackage.dao.PhysicianRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PhysicianRepository physicianRepository;

    // Get all schedules
    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // Get schedule by ID
    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Integer id) {
        return scheduleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new schedule
    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        // Fetch patient and physician from DB
        if (schedule.getPatient() == null || schedule.getPhysician() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Patient> patient = patientRepository.findById(schedule.getPatient().getId());
        Optional<Physician> physician = physicianRepository.findById(schedule.getPhysician().getId());

        if (!patient.isPresent() || !physician.isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        schedule.setPatient(patient.get());
        schedule.setPhysician(physician.get());

        Schedule saved = scheduleRepository.save(schedule);
        return ResponseEntity.ok(saved);
    }

    // Delete a schedule
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Integer id) {
        if (!scheduleRepository.existsById(id)) return ResponseEntity.notFound().build();
        scheduleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
