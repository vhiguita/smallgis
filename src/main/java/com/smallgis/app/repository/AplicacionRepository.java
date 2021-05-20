package com.smallgis.app.repository;

import com.smallgis.app.domain.Aplicacion;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;
/**
 * Spring Data MongoDB repository for the Aplicacion entity.
 */
@SuppressWarnings("unused")
public interface AplicacionRepository extends MongoRepository<Aplicacion,String> {
  Aplicacion findOneByUsuarioAndTitulo(String usuario, String titulo);
  List<Aplicacion> findOneByUsuario(String usuario);
  Long countByUsuario(String usuario);
}
