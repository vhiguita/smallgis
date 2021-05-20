package com.smallgis.app.service.impl;

import com.smallgis.app.service.RequirementService;
import com.smallgis.app.domain.Requirement;
import com.smallgis.app.repository.RequirementRepository;
import com.smallgis.app.web.rest.dto.RequirementDTO;
import com.smallgis.app.web.rest.mapper.RequirementMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing Requirement.
 */
@Service
public class RequirementServiceImpl implements RequirementService{

    private final Logger log = LoggerFactory.getLogger(RequirementServiceImpl.class);

    @Inject
    private RequirementRepository requirementRepository;

    @Inject
    private RequirementMapper requirementMapper;


    /**
     *  Get one requirment by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public RequirementDTO findOne(String reqid) {
        log.debug("Request to get Requirement : {}", reqid);
        Requirement requirement = requirementRepository.findOneByReqid(reqid);
        RequirementDTO requirementDTO = requirementMapper.requirementToRequirementDTO(requirement);
        return requirementDTO;
    }
    public RequirementDTO save(RequirementDTO requirementDTO) {
        Requirement requirement = requirementMapper.requirementDTOToRequirement(requirementDTO);
        requirement = requirementRepository.save(requirement);
        RequirementDTO result = requirementMapper.requirementToRequirementDTO(requirement);
        return result;
    }
    public List<RequirementDTO> findRequirementCompanyidFecha(String companyid,String fecha){
     
        List<Requirement> requirements = requirementRepository.findOneByCompanyidAndFecha(companyid,fecha);
        List<RequirementDTO> result=requirementMapper.requirementsToRequirementDTOs(requirements);
        return result;
    }
}
