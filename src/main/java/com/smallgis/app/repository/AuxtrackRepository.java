package com.smallgis.app.repository;

import com.smallgis.app.domain.Auxtrack;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the Track entity.
 */
@SuppressWarnings("unused")
public interface AuxtrackRepository extends MongoRepository<Auxtrack,String> {
 Auxtrack findOneByUser(String user);
 List<Auxtrack> findOneByEmpresaid(String empresaid);
 //Long deleteAuxtrackByUser(String user);
}
