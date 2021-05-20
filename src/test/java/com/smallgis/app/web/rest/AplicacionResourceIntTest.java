package com.smallgis.app.web.rest;

import com.smallgis.app.SmallgisApp;
import com.smallgis.app.domain.Aplicacion;
import com.smallgis.app.repository.AplicacionRepository;
import com.smallgis.app.service.AplicacionService;
import com.smallgis.app.web.rest.dto.AplicacionDTO;
import com.smallgis.app.web.rest.mapper.AplicacionMapper;

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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the AplicacionResource REST controller.
 *
 * @see AplicacionResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = SmallgisApp.class)
@WebAppConfiguration
@IntegrationTest
public class AplicacionResourceIntTest {

    private static final String DEFAULT_TITULO = "AAAAA";
    private static final String UPDATED_TITULO = "BBBBB";
    private static final String DEFAULT_MAPID = "AAAAA";
    private static final String UPDATED_MAPID = "BBBBB";
    private static final String DEFAULT_EMPRESA = "AAAAA";
    private static final String UPDATED_EMPRESA = "BBBBB";
    private static final String DEFAULT_USUARIO = "AAAAA";
    private static final String UPDATED_USUARIO = "BBBBB";
    private static final String DEFAULT_DESCRIPCION = "AAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBB";
    private static final String DEFAULT_TIPO_APP = "AAAAA";
    private static final String UPDATED_TIPO_APP = "BBBBB";

    private static final Boolean DEFAULT_ESPUBLICO = false;
    private static final Boolean UPDATED_ESPUBLICO = true;

    /*private static final LocalDate DEFAULT_FECHA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FECHA = LocalDate.now(ZoneId.systemDefault());*/

    private static final String DEFAULT_FECHA = "AAAAA";
    private static final String UPDATED_FECHA = "BBBBB";

    @Inject
    private AplicacionRepository aplicacionRepository;

    @Inject
    private AplicacionMapper aplicacionMapper;

    @Inject
    private AplicacionService aplicacionService;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restAplicacionMockMvc;

    private Aplicacion aplicacion;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        AplicacionResource aplicacionResource = new AplicacionResource();
        ReflectionTestUtils.setField(aplicacionResource, "aplicacionService", aplicacionService);
        ReflectionTestUtils.setField(aplicacionResource, "aplicacionMapper", aplicacionMapper);
        this.restAplicacionMockMvc = MockMvcBuilders.standaloneSetup(aplicacionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        aplicacionRepository.deleteAll();
        aplicacion = new Aplicacion();
        aplicacion.setTitulo(DEFAULT_TITULO);
        aplicacion.setMapid(DEFAULT_MAPID);
        aplicacion.setEmpresa(DEFAULT_EMPRESA);
        aplicacion.setUsuario(DEFAULT_USUARIO);
        aplicacion.setDescripcion(DEFAULT_DESCRIPCION);
        aplicacion.setTipoApp(DEFAULT_TIPO_APP);
        aplicacion.setEspublico(DEFAULT_ESPUBLICO);
        aplicacion.setFecha(DEFAULT_FECHA);
    }

    @Test
    public void createAplicacion() throws Exception {
        int databaseSizeBeforeCreate = aplicacionRepository.findAll().size();

        // Create the Aplicacion
        AplicacionDTO aplicacionDTO = aplicacionMapper.aplicacionToAplicacionDTO(aplicacion);

        restAplicacionMockMvc.perform(post("/api/aplicacions")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(aplicacionDTO)))
                .andExpect(status().isCreated());

        // Validate the Aplicacion in the database
        List<Aplicacion> aplicacions = aplicacionRepository.findAll();
        assertThat(aplicacions).hasSize(databaseSizeBeforeCreate + 1);
        Aplicacion testAplicacion = aplicacions.get(aplicacions.size() - 1);
        assertThat(testAplicacion.getTitulo()).isEqualTo(DEFAULT_TITULO);
        assertThat(testAplicacion.getMapid()).isEqualTo(DEFAULT_MAPID);
        assertThat(testAplicacion.getEmpresa()).isEqualTo(DEFAULT_EMPRESA);
        assertThat(testAplicacion.getUsuario()).isEqualTo(DEFAULT_USUARIO);
        assertThat(testAplicacion.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testAplicacion.getTipoApp()).isEqualTo(DEFAULT_TIPO_APP);
        assertThat(testAplicacion.isEspublico()).isEqualTo(DEFAULT_ESPUBLICO);
        assertThat(testAplicacion.getFecha()).isEqualTo(DEFAULT_FECHA);
    }

    @Test
    public void getAllAplicacions() throws Exception {
        // Initialize the database
        aplicacionRepository.save(aplicacion);

        // Get all the aplicacions
        restAplicacionMockMvc.perform(get("/api/aplicacions?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(aplicacion.getId())))
                .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO.toString())))
                .andExpect(jsonPath("$.[*].mapid").value(hasItem(DEFAULT_MAPID.toString())))
                .andExpect(jsonPath("$.[*].empresa").value(hasItem(DEFAULT_EMPRESA.toString())))
                .andExpect(jsonPath("$.[*].usuario").value(hasItem(DEFAULT_USUARIO.toString())))
                .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION.toString())))
                .andExpect(jsonPath("$.[*].tipoApp").value(hasItem(DEFAULT_TIPO_APP.toString())))
                .andExpect(jsonPath("$.[*].espublico").value(hasItem(DEFAULT_ESPUBLICO.booleanValue())))
                .andExpect(jsonPath("$.[*].fecha").value(hasItem(DEFAULT_FECHA.toString())));
    }

    @Test
    public void getAplicacion() throws Exception {
        // Initialize the database
        aplicacionRepository.save(aplicacion);

        // Get the aplicacion
        restAplicacionMockMvc.perform(get("/api/aplicacions/{id}", aplicacion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(aplicacion.getId()))
            .andExpect(jsonPath("$.titulo").value(DEFAULT_TITULO.toString()))
            .andExpect(jsonPath("$.mapid").value(DEFAULT_MAPID.toString()))
            .andExpect(jsonPath("$.empresa").value(DEFAULT_EMPRESA.toString()))
            .andExpect(jsonPath("$.usuario").value(DEFAULT_USUARIO.toString()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION.toString()))
            .andExpect(jsonPath("$.tipoApp").value(DEFAULT_TIPO_APP.toString()))
            .andExpect(jsonPath("$.espublico").value(DEFAULT_ESPUBLICO.booleanValue()))
            .andExpect(jsonPath("$.fecha").value(DEFAULT_FECHA.toString()));
    }

    @Test
    public void getNonExistingAplicacion() throws Exception {
        // Get the aplicacion
        restAplicacionMockMvc.perform(get("/api/aplicacions/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateAplicacion() throws Exception {
        // Initialize the database
        aplicacionRepository.save(aplicacion);
        int databaseSizeBeforeUpdate = aplicacionRepository.findAll().size();

        // Update the aplicacion
        Aplicacion updatedAplicacion = new Aplicacion();
        updatedAplicacion.setId(aplicacion.getId());
        updatedAplicacion.setTitulo(UPDATED_TITULO);
        updatedAplicacion.setMapid(UPDATED_MAPID);
        updatedAplicacion.setEmpresa(UPDATED_EMPRESA);
        updatedAplicacion.setUsuario(UPDATED_USUARIO);
        updatedAplicacion.setDescripcion(UPDATED_DESCRIPCION);
        updatedAplicacion.setTipoApp(UPDATED_TIPO_APP);
        updatedAplicacion.setEspublico(UPDATED_ESPUBLICO);
        updatedAplicacion.setFecha(UPDATED_FECHA);
        AplicacionDTO aplicacionDTO = aplicacionMapper.aplicacionToAplicacionDTO(updatedAplicacion);

        restAplicacionMockMvc.perform(put("/api/aplicacions")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(aplicacionDTO)))
                .andExpect(status().isOk());

        // Validate the Aplicacion in the database
        List<Aplicacion> aplicacions = aplicacionRepository.findAll();
        assertThat(aplicacions).hasSize(databaseSizeBeforeUpdate);
        Aplicacion testAplicacion = aplicacions.get(aplicacions.size() - 1);
        assertThat(testAplicacion.getTitulo()).isEqualTo(UPDATED_TITULO);
        assertThat(testAplicacion.getMapid()).isEqualTo(UPDATED_MAPID);
        assertThat(testAplicacion.getEmpresa()).isEqualTo(UPDATED_EMPRESA);
        assertThat(testAplicacion.getUsuario()).isEqualTo(UPDATED_USUARIO);
        assertThat(testAplicacion.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testAplicacion.getTipoApp()).isEqualTo(UPDATED_TIPO_APP);
        assertThat(testAplicacion.isEspublico()).isEqualTo(UPDATED_ESPUBLICO);
        assertThat(testAplicacion.getFecha()).isEqualTo(UPDATED_FECHA);
    }

    @Test
    public void deleteAplicacion() throws Exception {
        // Initialize the database
        aplicacionRepository.save(aplicacion);
        int databaseSizeBeforeDelete = aplicacionRepository.findAll().size();

        // Get the aplicacion
        restAplicacionMockMvc.perform(delete("/api/aplicacions/{id}", aplicacion.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Aplicacion> aplicacions = aplicacionRepository.findAll();
        assertThat(aplicacions).hasSize(databaseSizeBeforeDelete - 1);
    }
}
