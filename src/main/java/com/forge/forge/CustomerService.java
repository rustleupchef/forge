package com.forge.forge;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public void saveCustomer(Customer customer) {
        customerRepository.save(customer);
    }

    public Customer findCustomerByEmail(String email) {
        return customerRepository.findById(email).orElse(null);
    }

    public void deleteCustomer(String email) {
        customerRepository.deleteById(email);
    }

    public void updateCustomer(Customer customer) {
        saveCustomer(customer);
    }
}
