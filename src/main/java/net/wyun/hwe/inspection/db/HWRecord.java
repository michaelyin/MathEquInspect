/*
 * Copyright 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package net.wyun.hwe.inspection.db;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Version;
import javax.validation.constraints.Size;

import org.springframework.data.domain.Persistable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * @author michaelyin
 */
// tag::code[]
@Data
@Getter
@NoArgsConstructor
@Entity
@Table(name="hw_record")
public class HWRecord implements Persistable{

	private @Id Long id;
	
	
    private transient boolean isNew = false;

	
	public void setNew(boolean isNew) {
		this.isNew = isNew;
	}

	@Column(name = "scg_ink", nullable = false)
	@Size(min=1)
	private String scgInk;
	
	public void setId(Long id) {
		this.id = id;
	}

	public String getScgInk() {
		return scgInk;
	}

	public void setScgInk(String scgInk) {
		this.scgInk = scgInk;
	}

	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	@Column(name = "response", nullable = false)
	@Size(min=1)
	private String response;
	
	@Column(name = "request_at", nullable = false)
	private Date requestAt;
	
	@Column(name = "response_at")
	private Date responseAt;
	
	@Column(name = "processed")
	private boolean processed = false;
	
	public boolean isProcessed() {
		return processed;
	}

	public void setProcessed(boolean processed) {
		this.processed = processed;
	}

	private @Version @JsonIgnore Long version;

	/*
	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HWRecord)) return false;
        HWRecord record = (HWRecord) o;
        return id.equals(record.getId());
    }
 
    @Override
    public int hashCode() {
        return id == null ? 0 : id.hashCode();
    }
    */
    @Override
    public Serializable getId() {
        return id;
    }

	@Override
	public boolean isNew() {
		return this.isNew;
	}

}
// end::code[]