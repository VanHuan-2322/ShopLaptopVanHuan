package com.example.laptopstore.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleLoginRequest {

    @NotBlank(message = "Token không được để trống")
    private String idToken;
}