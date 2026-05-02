package com.clinic.backend.common.base;

import org.springframework.data.domain.Page;

import java.util.List;

public interface BaseService<Req, Res, F> {

    Res create(Req request);

    Res update(Long id, Req request);

    void delete(Long id);

    Res getById(Long id);

    Page<Res> search(F filter);
}