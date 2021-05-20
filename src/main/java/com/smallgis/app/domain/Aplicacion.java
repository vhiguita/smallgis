package com.smallgis.app.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Aplicacion.
 */

@Document(collection = "aplicacion")
public class Aplicacion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("titulo")
    private String titulo;

    @Field("mapid")
    private String mapid;

    @Field("empresa")
    private String empresa;

    @Field("usuario")
    private String usuario;

    @Field("descripcion")
    private String descripcion;

    @Field("tipo_app")
    private String tipoApp;

    @Field("espublico")
    private Boolean espublico;

    @Field("fecha")
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

    public Boolean isEspublico() {
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
        Aplicacion aplicacion = (Aplicacion) o;
        if(aplicacion.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, aplicacion.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Aplicacion{" +
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
