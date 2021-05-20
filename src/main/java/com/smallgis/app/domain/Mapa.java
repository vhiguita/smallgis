package com.smallgis.app.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Mapa.
 */

@Document(collection = "mapa")
public class Mapa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("titulo")
    private String titulo;

    @Field("empresa")
    private String empresa;

    @Field("usuario")
    private String usuario;

    @Field("descripcion")
    private String descripcion;

    @Field("capas")
    private String capas;

    @Field("esprivado")
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
        Mapa mapa = (Mapa) o;
        if(mapa.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, mapa.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Mapa{" +
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
