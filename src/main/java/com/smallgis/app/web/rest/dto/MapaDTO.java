package com.smallgis.app.web.rest.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the Mapa entity.
 */
public class MapaDTO implements Serializable {

    private String id;

    @NotNull
    private String titulo;

    @NotNull
    private String empresa;

    @NotNull
    private String usuario;

    @NotNull
    private String descripcion;

    @NotNull
    private String capas;

    private boolean esprivado;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    public String getEmpresa() {
        return empresa;
    }

    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }
    public String getUsuario() {
        return usuario;
    }
    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }
    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion= descripcion;
    }

    public String getCapas() {
        return capas;
    }

    public void setCapas(String capas) {
        this.capas= capas;
    }

    public boolean getEsprivado() {
        return esprivado;
    }

    public void setEsprivado(boolean esprivado) {
        this.esprivado= esprivado;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        MapaDTO mapaDTO = (MapaDTO) o;

        if ( ! Objects.equals(id, mapaDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "MapaDTO{" +
            "id=" + id +
            ", titulo='" + titulo + "'" +
            ", empresa='" + empresa + "'" +
            ", usuario='" + usuario + "'" +
            ", descripcion='" + descripcion+ "'" +
            ", capas='" + capas + "'" +
            ", esprivado='" + esprivado + "'" +
            '}';
    }
}
