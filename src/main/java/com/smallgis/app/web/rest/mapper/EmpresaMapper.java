package com.smallgis.app.web.rest.mapper;

import com.smallgis.app.domain.*;
import com.smallgis.app.web.rest.dto.EmpresaDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Capa and its DTO CapaDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface EmpresaMapper {

    EmpresaDTO empresaToEmpresaDTO(Empresa empresa);

    Empresa empresaDTOToEmpresa(EmpresaDTO empresaDTO);

    List<Empresa> empresaDTOsToEmpresas(List<EmpresaDTO> empresaDTOs);
}
