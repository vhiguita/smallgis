package com.smallgis.app.repository;

import com.smallgis.app.domain.Requirement;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the Requirement entity.
 */
@SuppressWarnings("unused")
public interface RequirementRepository extends MongoRepository<Requirement,String> {
 Requirement findOneByReqid(String reqid);
 List<Requirement> findOneByCompanyidAndFecha(String companyid,String fecha);
}
