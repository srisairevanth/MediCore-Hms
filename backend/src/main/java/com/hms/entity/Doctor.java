package com.hms.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="doctors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Doctor {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false) private String specialization;
    private String email;
    private String phone;
    @Builder.Default @Enumerated(EnumType.STRING) @Column(name="availability_status")
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.AVAILABLE;
    @ManyToOne(fetch=FetchType.EAGER) @JoinColumn(name="department_id") private Department department;
    public enum AvailabilityStatus { AVAILABLE, BUSY, OFF_DUTY }
}
