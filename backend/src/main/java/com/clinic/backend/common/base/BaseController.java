package com.clinic.backend.common.base;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;


public abstract class BaseController<Req, Res, F> {

    protected final BaseService<Req, Res, F> service;

    protected BaseController(BaseService<Req, Res, F> service) {
        this.service = service;
    }

    @PostMapping("create")
    public Res create(@Valid @RequestBody Req req) {
        return service.create(req);
    }

    @GetMapping("/{id}")
    public Res getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping()
    public Page<Res> search(@ModelAttribute F filter) {
        return service.search(filter);
    }

    @PutMapping("/{id}")
    public Res update(@PathVariable Long id,
                      @Valid @RequestBody Req req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}