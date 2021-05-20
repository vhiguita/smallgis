package com.smallgis.app.repository;

import com.smallgis.app.domain.Track;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the Track entity.
 */
@SuppressWarnings("unused")
public interface TrackRepository extends MongoRepository<Track,String> {
 Track findOneByEmpresaid(String empresaid);
}
