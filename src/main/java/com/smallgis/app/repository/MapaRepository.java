package com.smallgis.app.repository;

import com.smallgis.app.domain.Mapa;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the Mapa entity.
 */
@SuppressWarnings("unused")
public interface MapaRepository extends MongoRepository<Mapa,String> {
  Mapa findOneByUsuarioAndTitulo(String usuario, String titulo);
  List<Mapa> findOneByUsuario(String usuario);
  Long countByUsuario(String usuario);
}
