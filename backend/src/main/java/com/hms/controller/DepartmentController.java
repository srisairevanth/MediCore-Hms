package com.hms.controller;

import com.hms.entity.Department;
import com.hms.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository repo;

    @GetMapping  public List<Department> getAll() { return repo.findAll(); }

    @PostMapping
    public ResponseEntity<Department> create(@RequestBody Department d) {
        return ResponseEntity.ok(repo.save(d));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> update(@PathVariable Long id, @RequestBody Department body) {
        return repo.findById(id).map(d -> {
            d.setName(body.getName()); d.setFloor(body.getFloor());
            d.setTotalBeds(body.getTotalBeds()); d.setOccupiedBeds(body.getOccupiedBeds());
            return ResponseEntity.ok(repo.save(d));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id); return ResponseEntity.ok().build();
    }
}
