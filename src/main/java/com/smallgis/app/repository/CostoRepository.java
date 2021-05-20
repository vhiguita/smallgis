package com.smallgis.app.repository;

import com.smallgis.app.domain.Costo;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the Mapa entity.
 */
@SuppressWarnings("unused")
public interface CostoRepository extends MongoRepository<Costo,String> {
  Costo findOneByBusinessCode(String nit);
}
