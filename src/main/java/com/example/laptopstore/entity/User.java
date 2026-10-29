package com.example.laptopstore.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column
    private String password;

    @Column(nullable = false)
    private String fullName;

    private String phone;

    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
}