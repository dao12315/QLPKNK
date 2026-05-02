package com.clinic.backend.common.base;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public abstract class BaseServiceImpl<E, Req, Res>
        implements BaseService<Req, Res> {

    protected final BaseRepository<E, Long> repository;
    protected final BaseMapper<E, Req, Res> mapper;

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
    public List<Res> getAll() {
        return mapper.toList(repository.findAll());
    }
}