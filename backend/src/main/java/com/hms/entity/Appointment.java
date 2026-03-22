package com.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="appointments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Appointment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="patient_id",nullable=false) private Patient patient;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="doctor_id",nullable=false)  private Doctor doctor;
    @Column(name="appointment_time",nullable=false) private LocalDateTime appointmentTime;
    @Builder.Default @Enumerated(EnumType.STRING) private Status status = Status.PENDING;
    @Column(columnDefinition="TEXT") private String notes;
    @Builder.Default @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
    public enum Status { PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED }
}
