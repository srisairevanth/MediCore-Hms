package com.hms.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name="patients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Patient {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false) private Integer age;
    @Column(nullable=false) private String gender;
    private String phone;
    private String address;
    @Column(name="medical_history",columnDefinition="TEXT") private String medicalHistory;
    @Builder.Default @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
}
