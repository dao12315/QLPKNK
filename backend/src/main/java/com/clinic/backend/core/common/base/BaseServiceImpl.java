package com.clinic.backend.core.common.base;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;

import java.util.List;

public abstract class BaseServiceImpl<E, Req, Res, F, ID>
        implements BaseService<Req, Res, F, ID> {

    protected final BaseRepository<E, ID> repository;
    protected final BaseMapper<E, Req, Res> mapper;

    protected BaseServiceImpl(BaseRepository<E, ID> repository,
                              BaseMapper<E, Req, Res> mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Res create(Req request) {
        E entity = mapper.toEntity(request);
        entity = repository.saveAndFlush(entity);
        return mapper.toResponse(entity);
    }

    @Override
    public Res update(ID id, Req request) {
        E entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Not found"));

        mapper.update(entity, request);
        entity = repository.saveAndFlush(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void delete(ID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Not found");
        }
        repository.deleteById(id);
    }

    @Override
    public Res getById(ID id) {
        return mapper.toResponse(
                repository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Not found"))
        );
    }

    @Override
    public Page<Res> search(F filter) {
        throw new UnsupportedOperationException("Search not implemented");
    }
}