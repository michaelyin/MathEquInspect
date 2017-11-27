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
package net.wyun.hwe.inspection;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

/**
 * @author Greg Turnquist
 */
// tag::code[]
@Data
@Entity
@Table(name="equation")
public class Employee {

	private @Id @GeneratedValue Long id;
	
	@Column(name = "latex", nullable = false)
	private String firstName;
	
	@Column(name = "file_name", nullable = false)
	private String lastName;
	
	@Column(name = "image_name", nullable = false)
	private String description;
	
	@Column(name = "create_t", nullable = false)
	private Date createT;
	
	@Column(name = "modify_t")
	private Date modifyT;
	
	@Column(name = "verified")
	private boolean isVerified = false;
	
	private @Version @JsonIgnore Long version;

	@SuppressWarnings("unused")
	private Employee() {}

	public Employee(String firstName, String lastName, String description) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.description = description;
		this.createT = new Date();
	}
}
// end::code[]