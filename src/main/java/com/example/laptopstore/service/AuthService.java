package com.example.laptopstore.service;

import com.example.laptopstore.dto.*;
import com.example.laptopstore.entity.PasswordResetToken;
import com.example.laptopstore.entity.Role;
import com.example.laptopstore.entity.User;
import com.example.laptopstore.repository.PasswordResetTokenRepository;
import com.example.laptopstore.repository.UserRepository;
import com.example.laptopstore.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final GoogleAuthService googleAuthService;


    // =========================================================
    // ĐĂNG KÝ
    // =========================================================
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getAvatarUrl(),
                savedUser.getRole().name()
        );
    }


    // =========================================================
    // ĐĂNG NHẬP BẰNG EMAIL + PASSWORD
    // =========================================================
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy người dùng")
                );

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getRole().name()
        );
    }


    // =========================================================
    // ĐĂNG NHẬP BẰNG GOOGLE
    // =========================================================
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {

        // 1. Xác thực ID Token Google
        GoogleIdToken.Payload payload =
                googleAuthService.verify(request.getIdToken());

        // 2. Lấy thông tin từ tài khoản Google
        String email = payload.getEmail();

        String name = (String) payload.get("name");

        String pictureUrl = (String) payload.get("picture");


        // 3. Tìm user theo email
        // Nếu chưa có thì tự động tạo tài khoản mới
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {

                    User newUser = new User();

                    newUser.setEmail(email);

                    newUser.setFullName(
                            name != null ? name : email
                    );

                    // Tài khoản Google không cần password
                    newUser.setPassword(null);

                    // Lưu ảnh đại diện Google
                    newUser.setAvatarUrl(pictureUrl);

                    // Mặc định là USER
                    newUser.setRole(Role.USER);

                    return userRepository.save(newUser);
                });


        // 4. Tạo JWT của website LaptopStore
        String token = jwtUtil.generateToken(user.getEmail());


        // 5. Trả thông tin user + JWT về Frontend
        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getRole().name()
        );
    }


    // =========================================================
    // QUÊN MẬT KHẨU
    // =========================================================
    public void forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy tài khoản với email này"
                        )
                );

        PasswordResetToken resetToken = new PasswordResetToken();

        resetToken.setToken(UUID.randomUUID().toString());

        resetToken.setUser(user);

        resetToken.setExpiryDate(
                LocalDateTime.now().plusMinutes(30)
        );

        passwordResetTokenRepository.save(resetToken);

        emailService.sendPasswordResetEmail(
                user.getEmail(),
                resetToken.getToken()
        );
    }


    // =========================================================
    // ĐẶT LẠI MẬT KHẨU
    // =========================================================
    public void resetPassword(ResetPasswordRequest request) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository.findByToken(
                                request.getToken()
                        )
                        .orElseThrow(() ->
                                new RuntimeException("Token không hợp lệ")
                        );


        // Kiểm tra token đã sử dụng chưa
        if (resetToken.isUsed()) {
            throw new RuntimeException(
                    "Token này đã được sử dụng"
            );
        }


        // Kiểm tra token hết hạn chưa
        if (resetToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Token đã hết hạn"
            );
        }


        // Lấy user
        User user = resetToken.getUser();


        // Mã hóa mật khẩu mới
        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);


        // Đánh dấu token đã sử dụng
        resetToken.setUsed(true);

        passwordResetTokenRepository.save(resetToken);
    }
}