package com.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name="treatments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Treatment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="patient_id",nullable=false) private Patient patient;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="doctor_id",nullable=false)  private Doctor doctor;
    @Column(nullable=false) private String diagnosis;
    @Column(columnDefinition="TEXT") private String prescription;
    @Builder.Default @Column(name="treatment_date") private LocalDate    treatmentDate = LocalDate.now();
    @Builder.Default @Column(name="created_at")     private LocalDateTime createdAt    = LocalDateTime.now();
}
