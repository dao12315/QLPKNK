    package com.clinic.backend.module.user.spec;

    import com.clinic.backend.module.user.entity.User;
    import org.springframework.data.jpa.domain.Specification;

    public class UserSpecification {

        public static Specification<User> filter(String email, String name, String role) {
            return (root, query, cb) -> {

                var predicates = cb.conjunction();

                if (email != null && !email.isBlank()) {
                    predicates = cb.and(predicates,
                            cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%"));
                }

                if (name != null && !name.isBlank()) {
                    predicates = cb.and(predicates,
                            cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
                }

                if (role != null && !role.isBlank()) {
                    predicates = cb.and(predicates,
                            cb.equal(cb.lower(root.get("role")), role.toLowerCase()));
                }

                return predicates;
            };
        }
    }