package com.company.platform.rules;



import org.springframework.stereotype.Component;

@Component
public class RuleEngine {

    public void checkAmount(double amount) {
        if (amount > 100000) {
            throw new RuntimeException("Rule violation: amount exceeded");
        }
    }
}
