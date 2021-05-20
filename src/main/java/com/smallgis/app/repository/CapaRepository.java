package com.smallgis.app.repository;

import com.smallgis.app.domain.Capa;
import com.smallgis.app.domain.CapaA;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the Capa entity.
 */
@SuppressWarnings("unused")
public interface CapaRepository extends MongoRepository<Capa,String> {
 //Capa findOneByCapaUsername(String username, String name);
 CapaA findOneByUsuarioAndNombre(String usuario, String nombre);
 List<CapaA> findOneByUsuario(String user);
 Long countByUsuario(String user);
}
