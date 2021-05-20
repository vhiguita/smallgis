package com.smallgis.app.web.rest.mapper;

import com.smallgis.app.domain.*;
import com.smallgis.app.web.rest.dto.MapaDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Mapa and its DTO MapaDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface MapaMapper {

    MapaDTO mapaToMapaDTO(Mapa mapa);

    List<MapaDTO> mapasToMapaDTOs(List<Mapa> mapas);

    Mapa mapaDTOToMapa(MapaDTO mapaDTO);

    List<Mapa> mapaDTOsToMapas(List<MapaDTO> mapaDTOs);
}
