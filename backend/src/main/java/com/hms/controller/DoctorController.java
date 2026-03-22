package com.hms.controller;

import com.hms.entity.Doctor;
import com.hms.entity.Department;
import com.hms.repository.DoctorRepository;
import com.hms.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepo;
    private final DepartmentRepository deptRepo;

    @GetMapping
    public List<Doctor> getAll(@RequestParam(required=false) String search) {
        if (search != null && !search.isBlank())
            return doctorRepo.findByNameContainingIgnoreCaseOrSpecializationContainingIgnoreCase(search, search);
        return doctorRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getById(@PathVariable Long id) {
        return doctorRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Doctor> create(@RequestBody Map<String,Object> body) {
        Doctor d = buildDoctor(new Doctor(), body);
        return ResponseEntity.ok(doctorRepo.save(d));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable Long id, @RequestBody Map<String,Object> body) {
        return doctorRepo.findById(id).map(d -> ResponseEntity.ok(doctorRepo.save(buildDoctor(d, body))))
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        doctorRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private Doctor buildDoctor(Doctor d, Map<String,Object> body) {
        if (body.get("name")           != null) d.setName((String) body.get("name"));
        if (body.get("specialization") != null) d.setSpecialization((String) body.get("specialization"));
        if (body.get("email")          != null) d.setEmail((String) body.get("email"));
        if (body.get("phone")          != null) d.setPhone((String) body.get("phone"));
        if (body.get("availabilityStatus") != null)
            d.setAvailabilityStatus(Doctor.AvailabilityStatus.valueOf((String) body.get("availabilityStatus")));
        if (body.get("departmentId") != null) {
            Long deptId = Long.valueOf(body.get("departmentId").toString());
            deptRepo.findById(deptId).ifPresent(d::setDepartment);
        }
        return d;
    }
}
