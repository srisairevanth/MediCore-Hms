package com.hms.controller;

import com.hms.entity.Appointment;
import com.hms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository apptRepo;
    private final PatientRepository patientRepo;
    private final DoctorRepository  doctorRepo;

    @GetMapping
    public List<Appointment> getAll(@RequestParam(required=false) String status) {
        if (status != null && !status.isBlank())
            return apptRepo.findByStatus(Appointment.Status.valueOf(status));
        return apptRepo.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable Long id) {
        return apptRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String,Object> body) {
        try {
            Appointment a = buildAppointment(new Appointment(), body);
            return ResponseEntity.ok(apptRepo.save(a));
        } catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String,Object> body) {
        return apptRepo.findById(id).map(a -> ResponseEntity.ok(apptRepo.save(buildAppointment(a, body))))
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        apptRepo.deleteById(id); return ResponseEntity.ok().build();
    }

    private Appointment buildAppointment(Appointment a, Map<String,Object> body) {
        if (body.get("patientId") != null)
            patientRepo.findById(Long.valueOf(body.get("patientId").toString())).ifPresent(a::setPatient);
        if (body.get("doctorId")  != null)
            doctorRepo.findById(Long.valueOf(body.get("doctorId").toString())).ifPresent(a::setDoctor);
        if (body.get("appointmentTime") != null)
            a.setAppointmentTime(LocalDateTime.parse((String) body.get("appointmentTime")));
        if (body.get("notes")  != null) a.setNotes((String) body.get("notes"));
        if (body.get("status") != null) a.setStatus(Appointment.Status.valueOf((String) body.get("status")));
        return a;
    }
}
