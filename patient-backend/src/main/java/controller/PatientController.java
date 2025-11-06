package controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

    @GetMapping("/patients")
    public List<Patient> getPatients() {
        // Sample first and last names
        List<String> firstNames = Arrays.asList(
                "John", "Jane", "Michael", "Sarah", "David", "Emily", "Chris", "Olivia",
                "Daniel", "Sophia", "James", "Isabella", "Matthew", "Mia", "Anthony", "Amelia",
                "Andrew", "Evelyn", "Ryan", "Charlotte", "Jeniper", "Lucas", "Liam", "Emma",
                "Benjamin", "Ava", "Ethan", "Abigail", "Jacob", "Ella"
        );

        List<String> lastNames = Arrays.asList(
                "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
                "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
                "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
                "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Abreu"
        );

        Random rand = new Random();

        // Generate 1000 random patients
        return IntStream.rangeClosed(1, 1000)
                .mapToObj(i -> {
                    String first = firstNames.get(rand.nextInt(firstNames.size()));
                    String last = lastNames.get(rand.nextInt(lastNames.size()));
                    return new Patient(i, first + " " + last);
                })
                .collect(Collectors.toList());
    }

    // Inner class to represent a Patient
    public static class Patient {
        private int id;
        private String name;

        public Patient(int id, String name) {
            this.id = id;
            this.name = name;
        }

        public int getId() { return id; }
        public void setId(int id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}
