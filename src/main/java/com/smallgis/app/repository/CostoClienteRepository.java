package com.smallgis.app.repository;

import com.smallgis.app.domain.CostoCliente;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the Mapa entity.
 */
@SuppressWarnings("unused")
public interface CostoClienteRepository extends MongoRepository<CostoCliente,String> {
  List<CostoCliente> findOneByClientAndFecha(String cliente,String fecha);
}
