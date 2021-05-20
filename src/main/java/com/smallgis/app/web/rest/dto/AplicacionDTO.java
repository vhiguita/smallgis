package com.smallgis.app.web.rest.dto;

import java.time.LocalDate;
import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the Aplicacion entity.
 */
public class AplicacionDTO implements Serializable {

    private String id;

    private String titulo;

    private String mapid;

    private String empresa;

    private String usuario;

    private String descripcion;

    private String tipoApp;

    private Boolean espublico;

    private String fecha;


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
    public String getMapid() {
        return mapid;
    }

    public void setMapid(String mapid) {
        this.mapid = mapid;
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
        this.descripcion = descripcion;
    }
    public String getTipoApp() {
        return tipoApp;
    }

    public void setTipoApp(String tipoApp) {
        this.tipoApp = tipoApp;
    }
    public Boolean getEspublico() {
        return espublico;
    }

    public void setEspublico(Boolean espublico) {
        this.espublico = espublico;
    }
    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        AplicacionDTO aplicacionDTO = (AplicacionDTO) o;

        if ( ! Objects.equals(id, aplicacionDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "AplicacionDTO{" +
            "id=" + id +
            ", titulo='" + titulo + "'" +
            ", mapid='" + mapid + "'" +
            ", empresa='" + empresa + "'" +
            ", usuario='" + usuario + "'" +
            ", descripcion='" + descripcion + "'" +
            ", tipoApp='" + tipoApp + "'" +
            ", espublico='" + espublico + "'" +
            ", fecha='" + fecha + "'" +
            '}';
    }
}
