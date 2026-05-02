package com.clinic.backend.common.base;

import java.util.List;

public interface BaseService<Req, Res> {

    Res create(Req request);

    Res update(Long id, Req request);

    void delete(Long id);

    Res getById(Long id);

    List<Res> getAll();
}