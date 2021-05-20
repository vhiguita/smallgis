package com.smallgis.app.web.rest;

import com.smallgis.app.SmallgisApp;
import com.smallgis.app.domain.Capa;
import com.smallgis.app.repository.CapaRepository;
import com.smallgis.app.service.CapaService;
import com.smallgis.app.web.rest.dto.CapaDTO;
import com.smallgis.app.web.rest.mapper.CapaMapper;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the CapaResource REST controller.
 *
 * @see CapaResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = SmallgisApp.class)
@WebAppConfiguration
@IntegrationTest
public class CapaResourceIntTest {

    private static final String DEFAULT_NOMBRE = "AAAAA";
    private static final String UPDATED_NOMBRE = "BBBBB";
    private static final String DEFAULT_EMPRESA = "AAAAA";
    private static final String UPDATED_EMPRESA = "BBBBB";
    private static final String DEFAULT_USUARIO = "AAAAA";
    private static final String UPDATED_USUARIO = "BBBBB";

    @Inject
    private CapaRepository capaRepository;

    @Inject
    private CapaMapper capaMapper;

    @Inject
    private CapaService capaService;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restCapaMockMvc;

    private Capa capa;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        CapaResource capaResource = new CapaResource();
        ReflectionTestUtils.setField(capaResource, "capaService", capaService);
        ReflectionTestUtils.setField(capaResource, "capaMapper", capaMapper);
        this.restCapaMockMvc = MockMvcBuilders.standaloneSetup(capaResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        capaRepository.deleteAll();
        capa = new Capa();
        capa.setNombre(DEFAULT_NOMBRE);
        capa.setEmpresa(DEFAULT_EMPRESA);
        capa.setUsuario(DEFAULT_USUARIO);
    }

    @Test
    public void createCapa() throws Exception {
        int databaseSizeBeforeCreate = capaRepository.findAll().size();

        // Create the Capa
        CapaDTO capaDTO = capaMapper.capaToCapaDTO(capa);

        restCapaMockMvc.perform(post("/api/capas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(capaDTO)))
                .andExpect(status().isCreated());

        // Validate the Capa in the database
        List<Capa> capas = capaRepository.findAll();
        assertThat(capas).hasSize(databaseSizeBeforeCreate + 1);
        Capa testCapa = capas.get(capas.size() - 1);
        assertThat(testCapa.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testCapa.getEmpresa()).isEqualTo(DEFAULT_EMPRESA);
        assertThat(testCapa.getUsuario()).isEqualTo(DEFAULT_USUARIO);
    }

    @Test
    public void checkNombreIsRequired() throws Exception {
        int databaseSizeBeforeTest = capaRepository.findAll().size();
        // set the field null
        capa.setNombre(null);

        // Create the Capa, which fails.
        CapaDTO capaDTO = capaMapper.capaToCapaDTO(capa);

        restCapaMockMvc.perform(post("/api/capas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(capaDTO)))
                .andExpect(status().isBadRequest());

        List<Capa> capas = capaRepository.findAll();
        assertThat(capas).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkEmpresaIsRequired() throws Exception {
        int databaseSizeBeforeTest = capaRepository.findAll().size();
        // set the field null
        capa.setEmpresa(null);

        // Create the Capa, which fails.
        CapaDTO capaDTO = capaMapper.capaToCapaDTO(capa);

        restCapaMockMvc.perform(post("/api/capas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(capaDTO)))
                .andExpect(status().isBadRequest());

        List<Capa> capas = capaRepository.findAll();
        assertThat(capas).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkUsuarioIsRequired() throws Exception {
        int databaseSizeBeforeTest = capaRepository.findAll().size();
        // set the field null
        capa.setUsuario(null);

        // Create the Capa, which fails.
        CapaDTO capaDTO = capaMapper.capaToCapaDTO(capa);

        restCapaMockMvc.perform(post("/api/capas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(capaDTO)))
                .andExpect(status().isBadRequest());

        List<Capa> capas = capaRepository.findAll();
        assertThat(capas).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllCapas() throws Exception {
        // Initialize the database
        capaRepository.save(capa);

        // Get all the capas
        restCapaMockMvc.perform(get("/api/capas?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(capa.getId())))
                .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE.toString())))
                .andExpect(jsonPath("$.[*].empresa").value(hasItem(DEFAULT_EMPRESA.toString())))
                .andExpect(jsonPath("$.[*].usuario").value(hasItem(DEFAULT_USUARIO.toString())));
    }

    @Test
    public void getCapa() throws Exception {
        // Initialize the database
        capaRepository.save(capa);

        // Get the capa
        restCapaMockMvc.perform(get("/api/capas/{id}", capa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(capa.getId()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE.toString()))
            .andExpect(jsonPath("$.empresa").value(DEFAULT_EMPRESA.toString()))
            .andExpect(jsonPath("$.usuario").value(DEFAULT_USUARIO.toString()));
    }

    @Test
    public void getNonExistingCapa() throws Exception {
        // Get the capa
        restCapaMockMvc.perform(get("/api/capas/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateCapa() throws Exception {
        // Initialize the database
        capaRepository.save(capa);
        int databaseSizeBeforeUpdate = capaRepository.findAll().size();

        // Update the capa
        Capa updatedCapa = new Capa();
        updatedCapa.setId(capa.getId());
        updatedCapa.setNombre(UPDATED_NOMBRE);
        updatedCapa.setEmpresa(UPDATED_EMPRESA);
        updatedCapa.setUsuario(UPDATED_USUARIO);
        CapaDTO capaDTO = capaMapper.capaToCapaDTO(updatedCapa);

        restCapaMockMvc.perform(put("/api/capas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(capaDTO)))
                .andExpect(status().isOk());

        // Validate the Capa in the database
        List<Capa> capas = capaRepository.findAll();
        assertThat(capas).hasSize(databaseSizeBeforeUpdate);
        Capa testCapa = capas.get(capas.size() - 1);
        assertThat(testCapa.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testCapa.getEmpresa()).isEqualTo(UPDATED_EMPRESA);
        assertThat(testCapa.getUsuario()).isEqualTo(UPDATED_USUARIO);
    }

    @Test
    public void deleteCapa() throws Exception {
        // Initialize the database
        capaRepository.save(capa);
        int databaseSizeBeforeDelete = capaRepository.findAll().size();

        // Get the capa
        restCapaMockMvc.perform(delete("/api/capas/{id}", capa.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Capa> capas = capaRepository.findAll();
        assertThat(capas).hasSize(databaseSizeBeforeDelete - 1);
    }
}
