package com.company.platform.rules;



import com.company.platform.rules.BusinessRule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RuleRepository extends JpaRepository<BusinessRule, Long> {
}
