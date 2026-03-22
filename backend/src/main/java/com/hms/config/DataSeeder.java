package com.hms.config;

import com.hms.entity.*;
import com.hms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Component @RequiredArgsConstructor @Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository        userRepo;
    private final DepartmentRepository  deptRepo;
    private final DoctorRepository      doctorRepo;
    private final PatientRepository     patientRepo;
    private final AppointmentRepository apptRepo;
    private final PasswordEncoder       encoder;

    @Override @Transactional
    public void run(String... args) {
        if (userRepo.count() > 0) { log.info("Already seeded."); return; }
        log.info("Seeding demo data...");

        userRepo.save(User.builder().name("Admin User").email("admin@hms.com")
            .password(encoder.encode("admin123")).role(User.Role.ADMIN).build());

        Department cardio  = deptRepo.save(Department.builder().name("Cardiology").floor("3rd Floor").totalBeds(30).occupiedBeds(18).build());
        Department neuro   = deptRepo.save(Department.builder().name("Neurology").floor("4th Floor").totalBeds(25).occupiedBeds(12).build());
        Department ortho   = deptRepo.save(Department.builder().name("Orthopedics").floor("2nd Floor").totalBeds(40).occupiedBeds(22).build());
        Department peds    = deptRepo.save(Department.builder().name("Pediatrics").floor("1st Floor").totalBeds(35).occupiedBeds(15).build());
        deptRepo.save(Department.builder().name("Emergency").floor("Ground Floor").totalBeds(20).occupiedBeds(14).build());

        Doctor d1 = doctorRepo.save(Doctor.builder().name("Dr. Arjun Sharma").specialization("Cardiology").email("arjun@hms.com").phone("+91 9876543210").availabilityStatus(Doctor.AvailabilityStatus.AVAILABLE).department(cardio).build());
        Doctor d2 = doctorRepo.save(Doctor.builder().name("Dr. Priya Nair").specialization("Neurology").email("priya@hms.com").phone("+91 9876543211").availabilityStatus(Doctor.AvailabilityStatus.BUSY).department(neuro).build());
        Doctor d3 = doctorRepo.save(Doctor.builder().name("Dr. Rahul Mehta").specialization("Orthopedics").email("rahul@hms.com").phone("+91 9876543212").availabilityStatus(Doctor.AvailabilityStatus.AVAILABLE).department(ortho).build());
        doctorRepo.save(Doctor.builder().name("Dr. Sunita Rao").specialization("Pediatrics").email("sunita@hms.com").phone("+91 9876543213").availabilityStatus(Doctor.AvailabilityStatus.AVAILABLE).department(peds).build());

        Patient p1 = patientRepo.save(Patient.builder().name("Ravi Kumar").age(45).gender("Male").phone("+91 9000000001").address("Hyderabad").medicalHistory("Hypertension").build());
        Patient p2 = patientRepo.save(Patient.builder().name("Sunita Devi").age(32).gender("Female").phone("+91 9000000002").address("Secunderabad").medicalHistory("Diabetes Type 2").build());
        Patient p3 = patientRepo.save(Patient.builder().name("Mohan Reddy").age(58).gender("Male").phone("+91 9000000003").address("Warangal").medicalHistory("Arthritis").build());
        patientRepo.save(Patient.builder().name("Anjali Singh").age(27).gender("Female").phone("+91 9000000004").address("Chennai").medicalHistory("None").build());

        apptRepo.save(Appointment.builder().patient(p1).doctor(d1).appointmentTime(LocalDateTime.now().plusDays(1)).status(Appointment.Status.CONFIRMED).notes("Regular checkup").build());
        apptRepo.save(Appointment.builder().patient(p2).doctor(d2).appointmentTime(LocalDateTime.now().plusDays(2)).status(Appointment.Status.PENDING).notes("Follow-up").build());
        apptRepo.save(Appointment.builder().patient(p3).doctor(d3).appointmentTime(LocalDateTime.now().minusDays(1)).status(Appointment.Status.COMPLETED).notes("Knee consultation").build());

        log.info("✅ Seeded! Login: admin@hms.com / admin123");
    }
}
