package com.clinic.backend.common.base;

import org.springframework.data.domain.Page;

import java.util.List;

public interface BaseService<Req, Res, F, ID> {

    Res create(Req request);

    Res update(ID id, Req request);

    void delete(ID id);

    Res getById(ID id);

    Page<Res> search(F filter);
}