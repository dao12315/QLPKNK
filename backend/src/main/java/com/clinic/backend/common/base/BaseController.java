package com.clinic.backend.common.base;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
public abstract class BaseController<Req, Res> {

    protected final BaseService<Req, Res> service;

    @PostMapping
    public Res create(@RequestBody Req request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Res update(@PathVariable Long id, @RequestBody Req request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/{id}")
    public Res getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<Res> getAll() {
        return service.getAll();
    }
}