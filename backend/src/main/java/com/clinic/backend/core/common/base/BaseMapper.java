package com.clinic.backend.core.common.base;

import java.util.List;

public interface BaseMapper<E, Req, Res> {

    E toEntity(Req req);

    Res toResponse(E entity);

    List<Res> toList(List<E> entities);

    void update(E entity, Req req);
}