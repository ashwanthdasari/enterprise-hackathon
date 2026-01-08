package com.company.platform.audit;



import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class AuditLog {

    @Id @GeneratedValue
    private Long id;

    private String action;
    private String entity;
    private LocalDateTime at;

    public void setAction(String action) {

    }

    public void setEntity(String entity) {
    }

    public void setPerformedBy(String performedBy) {
    }

    public void setPerformedAt(LocalDateTime now) {
    }
}

