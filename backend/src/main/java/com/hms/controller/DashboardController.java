package com.hms.controller;

import com.hms.entity.Appointment;
import com.hms.entity.Doctor;
import com.hms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final PatientRepository     patientRepo;
    private final DoctorRepository      doctorRepo;
    private final AppointmentRepository apptRepo;
    private final DepartmentRepository  deptRepo;
    private final TreatmentRepository   treatRepo;

    @GetMapping("/stats")
    public Map<String,Object> stats() {
        return Map.of(
            "totalPatients",     patientRepo.count(),
            "totalDoctors",      doctorRepo.count(),
            "totalAppointments", apptRepo.count(),
            "totalDepartments",  deptRepo.count(),
            "totalTreatments",   treatRepo.count(),
            "availableDoctors",  doctorRepo.findByAvailabilityStatus(Doctor.AvailabilityStatus.AVAILABLE).size(),
            "pendingAppts",      apptRepo.countByStatus(Appointment.Status.PENDING),
            "completedAppts",    apptRepo.countByStatus(Appointment.Status.COMPLETED),
            "recentAppointments",apptRepo.findAllByOrderByCreatedAtDesc().stream().limit(5).toList()
        );
    }
}
