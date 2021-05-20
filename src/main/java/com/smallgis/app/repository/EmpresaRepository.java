package com.smallgis.app.repository;

import com.smallgis.app.domain.Empresa;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the Capa entity.
 */
@SuppressWarnings("unused")
public interface EmpresaRepository extends MongoRepository<Empresa,String> {
 Empresa findOneByEmpresanitAndEmpresacode(String empresanit, String empresacode);
 Empresa findOneByEmpresanit(String empresanit);
 Empresa findOneByEmpresacode(String empresacode);
}
