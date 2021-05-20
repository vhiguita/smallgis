package com.smallgis.app.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Capa.
 */

@Document(collection = "track")
public class Track implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("empresaid")
    private String empresaid;

    @NotNull
    @Field("fecha")
    private String fecha;

    @NotNull
    @Field("features")
    private String features;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getEmpresaid() {
        return empresaid;
    }
    public void setEmpresaid(String empresaid) {
        this.empresaid = empresaid;
    }
    public String getFecha() {
        return fecha;
    }
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
    public String getFeatures() {
        return features;
    }
    public void setFeatures(String features){
      this.features=features;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Track track = (Track) o;
        if(track.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, track.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
            /*return "Capa{" +
                  "id=" + id +
                  ", nombre='" + nombre + "'" +
                  ", empresa='" + empresa + "'" +
                  ", usuario='" + usuario + "'" +
                  ", type='" + type + "'" +
                  ", descripcion='" + descripcion + "'" +
                  ", features='" + features + "'" +
                  '}';*/

                  return "Track{" +
                        "id=" + id +
                        ", empresaid='" + empresaid + "'" +
                        ", fecha='" + fecha + "'" +
                        ", features='" + features + "'" +
                        '}';
    }
}
