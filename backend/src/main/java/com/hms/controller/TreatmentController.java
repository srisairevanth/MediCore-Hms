package com.hms.controller;

import com.hms.entity.Treatment;
import com.hms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/treatments")
@RequiredArgsConstructor
public class TreatmentController {

    private final TreatmentRepository treatRepo;
    private final PatientRepository   patientRepo;
    private final DoctorRepository    doctorRepo;

    @GetMapping
    public List<Treatment> getAll() { return treatRepo.findAll(); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String,Object> body) {
        try {
            Treatment t = new Treatment();
            patientRepo.findById(Long.valueOf(body.get("patientId").toString())).ifPresent(t::setPatient);
            doctorRepo.findById(Long.valueOf(body.get("doctorId").toString())).ifPresent(t::setDoctor);
            t.setDiagnosis((String) body.get("diagnosis"));
            if (body.get("prescription")  != null) t.setPrescription((String) body.get("prescription"));
            if (body.get("treatmentDate") != null) t.setTreatmentDate(LocalDate.parse((String) body.get("treatmentDate")));
            return ResponseEntity.ok(treatRepo.save(t));
        } catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        treatRepo.deleteById(id); return ResponseEntity.ok().build();
    }
}
