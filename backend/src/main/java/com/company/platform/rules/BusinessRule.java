package com.company.platform.rules;



import jakarta.persistence.*;

@Entity
public class BusinessRule {

    @Id @GeneratedValue
    private Long id;

    private String ruleKey;
    private String ruleValue;
}

