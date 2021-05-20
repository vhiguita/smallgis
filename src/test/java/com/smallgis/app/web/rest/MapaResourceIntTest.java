package com.smallgis.app.web.rest;

import com.smallgis.app.SmallgisApp;
import com.smallgis.app.domain.Mapa;
import com.smallgis.app.repository.MapaRepository;
import com.smallgis.app.service.MapaService;
import com.smallgis.app.web.rest.dto.MapaDTO;
import com.smallgis.app.web.rest.mapper.MapaMapper;

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
 * Test class for the MapaResource REST controller.
 *
 * @see MapaResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = SmallgisApp.class)
@WebAppConfiguration
@IntegrationTest
public class MapaResourceIntTest {

    private static final String DEFAULT_TITULO = "AAAAA";
    private static final String UPDATED_TITULO = "BBBBB";
    private static final String DEFAULT_EMPRESA = "AAAAA";
    private static final String UPDATED_EMPRESA = "BBBBB";
    private static final String DEFAULT_USUARIO = "AAAAA";
    private static final String UPDATED_USUARIO = "BBBBB";

    @Inject
    private MapaRepository mapaRepository;

    @Inject
    private MapaMapper mapaMapper;

    @Inject
    private MapaService mapaService;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restMapaMockMvc;

    private Mapa mapa;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        MapaResource mapaResource = new MapaResource();
        ReflectionTestUtils.setField(mapaResource, "mapaService", mapaService);
        ReflectionTestUtils.setField(mapaResource, "mapaMapper", mapaMapper);
        this.restMapaMockMvc = MockMvcBuilders.standaloneSetup(mapaResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        mapaRepository.deleteAll();
        mapa = new Mapa();
        mapa.setTitulo(DEFAULT_TITULO);
        mapa.setEmpresa(DEFAULT_EMPRESA);
        mapa.setUsuario(DEFAULT_USUARIO);
    }

    @Test
    public void createMapa() throws Exception {
        int databaseSizeBeforeCreate = mapaRepository.findAll().size();

        // Create the Mapa
        MapaDTO mapaDTO = mapaMapper.mapaToMapaDTO(mapa);

        restMapaMockMvc.perform(post("/api/mapas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(mapaDTO)))
                .andExpect(status().isCreated());

        // Validate the Mapa in the database
        List<Mapa> mapas = mapaRepository.findAll();
        assertThat(mapas).hasSize(databaseSizeBeforeCreate + 1);
        Mapa testMapa = mapas.get(mapas.size() - 1);
        assertThat(testMapa.getTitulo()).isEqualTo(DEFAULT_TITULO);
        assertThat(testMapa.getEmpresa()).isEqualTo(DEFAULT_EMPRESA);
        assertThat(testMapa.getUsuario()).isEqualTo(DEFAULT_USUARIO);
    }

    @Test
    public void getAllMapas() throws Exception {
        // Initialize the database
        mapaRepository.save(mapa);

        // Get all the mapas
        restMapaMockMvc.perform(get("/api/mapas?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(mapa.getId())))
                .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO.toString())))
                .andExpect(jsonPath("$.[*].empresa").value(hasItem(DEFAULT_EMPRESA.toString())))
                .andExpect(jsonPath("$.[*].usuario").value(hasItem(DEFAULT_USUARIO.toString())));
    }

    @Test
    public void getMapa() throws Exception {
        // Initialize the database
        mapaRepository.save(mapa);

        // Get the mapa
        restMapaMockMvc.perform(get("/api/mapas/{id}", mapa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(mapa.getId()))
            .andExpect(jsonPath("$.titulo").value(DEFAULT_TITULO.toString()))
            .andExpect(jsonPath("$.empresa").value(DEFAULT_EMPRESA.toString()))
            .andExpect(jsonPath("$.usuario").value(DEFAULT_USUARIO.toString()));
    }

    @Test
    public void getNonExistingMapa() throws Exception {
        // Get the mapa
        restMapaMockMvc.perform(get("/api/mapas/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateMapa() throws Exception {
        // Initialize the database
        mapaRepository.save(mapa);
        int databaseSizeBeforeUpdate = mapaRepository.findAll().size();

        // Update the mapa
        Mapa updatedMapa = new Mapa();
        updatedMapa.setId(mapa.getId());
        updatedMapa.setTitulo(UPDATED_TITULO);
        updatedMapa.setEmpresa(UPDATED_EMPRESA);
        updatedMapa.setUsuario(UPDATED_USUARIO);
        MapaDTO mapaDTO = mapaMapper.mapaToMapaDTO(updatedMapa);

        restMapaMockMvc.perform(put("/api/mapas")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(mapaDTO)))
                .andExpect(status().isOk());

        // Validate the Mapa in the database
        List<Mapa> mapas = mapaRepository.findAll();
        assertThat(mapas).hasSize(databaseSizeBeforeUpdate);
        Mapa testMapa = mapas.get(mapas.size() - 1);
        assertThat(testMapa.getTitulo()).isEqualTo(UPDATED_TITULO);
        assertThat(testMapa.getEmpresa()).isEqualTo(UPDATED_EMPRESA);
        assertThat(testMapa.getUsuario()).isEqualTo(UPDATED_USUARIO);
    }

    @Test
    public void deleteMapa() throws Exception {
        // Initialize the database
        mapaRepository.save(mapa);
        int databaseSizeBeforeDelete = mapaRepository.findAll().size();

        // Get the mapa
        restMapaMockMvc.perform(delete("/api/mapas/{id}", mapa.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Mapa> mapas = mapaRepository.findAll();
        assertThat(mapas).hasSize(databaseSizeBeforeDelete - 1);
    }
}
