package com.clinic.backend.core.common.base;

import java.util.List;
import java.util.stream.Collectors;

public abstract class BaseMapperImpl<E, Req, Res>
        implements BaseMapper<E, Req, Res> {

    @Override
    public List<Res> toList(List<E> entities) {
        if (entities == null || entities.isEmpty()) {
            return List.of();
        }
        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Optional helper nếu muốn override mapping từng phần tử
     */
    protected Res safeToResponse(E entity) {
        return toResponse(entity);
    }
}