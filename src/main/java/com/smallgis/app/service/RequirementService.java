package com.smallgis.app.service;

import com.smallgis.app.domain.Requirement;
import com.smallgis.app.web.rest.dto.RequirementDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.LinkedList;
import java.util.List;

/**
 * Service Interface for managing Requirement.
 */
public interface RequirementService {

    /**
     *  Get the "reqid" requirement.
     *
     *  @param reqid the reqid of the entity
     *  @return the entity
     */
    RequirementDTO save(RequirementDTO requirementDTO);
    RequirementDTO findOne(String reqid);
    List<RequirementDTO> findRequirementCompanyidFecha(String companyid,String fecha);
}
