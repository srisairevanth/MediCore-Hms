package com.hms.controller;

import com.hms.entity.Patient;
import com.hms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRepository repo;

    @GetMapping
    public List<Patient> getAll(@RequestParam(required=false) String search) {
        if (search != null && !search.isBlank()) return repo.findByNameContainingIgnoreCase(search);
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getById(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Patient> create(@RequestBody Patient patient) {
        return ResponseEntity.ok(repo.save(patient));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> update(@PathVariable Long id, @RequestBody Patient body) {
        return repo.findById(id).map(p -> {
            p.setName(body.getName()); p.setAge(body.getAge()); p.setGender(body.getGender());
            p.setPhone(body.getPhone()); p.setAddress(body.getAddress()); p.setMedicalHistory(body.getMedicalHistory());
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
