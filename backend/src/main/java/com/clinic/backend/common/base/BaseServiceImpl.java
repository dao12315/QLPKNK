package com.clinic.backend.common.base;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;

import java.util.List;

public abstract class BaseServiceImpl<E, Req, Res, F>
        implements BaseService<Req, Res, F> {

    protected final BaseRepository<E, Long> repository;
    protected final BaseMapper<E, Req, Res> mapper;

    protected BaseServiceImpl(BaseRepository<E, Long> repository,
                              BaseMapper<E, Req, Res> mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Res create(Req request) {
        E entity = mapper.toEntity(request);
        repository.save(entity);
        return mapper.toResponse(entity);
    }

    @Override
    public Res update(Long id, Req request) {
        E entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Not found"));

        mapper.update(entity, request);
        repository.save(entity);

        return mapper.toResponse(entity);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Not found");
        }
        repository.deleteById(id);
    }

    @Override
    public Res getById(Long id) {
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