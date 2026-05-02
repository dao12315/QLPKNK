package com.clinic.backend.module.user.service.impl;

import com.clinic.backend.common.base.BaseServiceImpl;
import com.clinic.backend.common.exception.BadRequestException;
import com.clinic.backend.module.user.dto.CreateUserRequest;
import com.clinic.backend.module.auth.dto.TokenResponse;
import com.clinic.backend.module.user.dto.UserFilter;
import com.clinic.backend.module.user.dto.UserResponse;
import com.clinic.backend.module.user.entity.User;
import com.clinic.backend.module.user.mapper.UserMapper;
import com.clinic.backend.module.user.repository.UserRepository;
import com.clinic.backend.module.user.service.UserService;
import com.clinic.backend.module.user.spec.UserSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl
        extends BaseServiceImpl<User, CreateUserRequest, UserResponse,UserFilter>
        implements UserService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserServiceImpl(UserRepository repo,
                           UserMapper mapper,
                           PasswordEncoder encoder) {
        super(repo, mapper);
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public UserResponse create(CreateUserRequest req) {

        if (repo.findByEmail(req.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User u = mapper.toEntity(req);

        u.setPassword(encoder.encode(req.getPassword()));
        u.setRole(req.getRole().toLowerCase());

        repo.save(u);

        return mapper.toResponse(u);
    }
    @Override
    public Page<UserResponse> search(UserFilter filter) {

        // parse sort
        String[] sortArr = filter.getSort().split(",");
        Sort sort = Sort.by(
                sortArr.length > 1 && sortArr[1].equalsIgnoreCase("desc")
                        ? Sort.Direction.DESC
                        : Sort.Direction.ASC,
                sortArr[0]
        );

        Pageable pageable = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                sort
        );

        var spec = UserSpecification.filter(
                filter.getEmail(),
                filter.getName(),
                filter.getRole()
        );

        return repo.findAll(spec, pageable)
                .map(mapper::toResponse);
    }
}