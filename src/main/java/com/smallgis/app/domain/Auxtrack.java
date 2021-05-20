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

@Document(collection = "auxtrack")
public class Auxtrack implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("empresaid")
    private String empresaid;

    @NotNull
    @Field("user")
    private String user;

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
    public String getUser() {
        return user;
    }
    public void setUser(String user) {
        this.user = user;
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
        Auxtrack track = (Auxtrack) o;
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
          return "Auxtrack{" +
                "id=" + id +
                ", empresaid='" + empresaid + "'" +
                ", user='" + user + "'" +
                ", features='" + features + "'" +
                '}';
    }
}
