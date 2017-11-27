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

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import net.wyun.hwe.inspection.config.InspectConfig;
import net.wyun.hwe.inspection.hwequation.ListDataLoader;

/**
 * @author Greg Turnquist
 */
// tag::code[]
@Component
public class DatabaseLoader implements CommandLineRunner {

	private final EmployeeRepository repository;
	private final ListDataLoader listLoader;

	@Autowired
	public DatabaseLoader(EmployeeRepository repository, ListDataLoader listLoader) {
		this.repository = repository;
		this.listLoader = listLoader;
	}
	
	@Autowired
	private InspectConfig config;
	
	private String prefix = "im2latex_";
	private String imageServer = "http://localhost:9000/";
	private String PNG = ".png";

	@Override
	public void run(String... strings) throws Exception {
		
		//String dir = "/home/michael/PycharmProjects/im2markup-prep/data/batch/";
		String dir = config.getSrcDir();
		imageServer = config.getImageServer();
		List<String> formulas = listLoader.loadListFromFile(dir + prefix + "formulas.lst");
		List<String> trainList = listLoader.loadListFromFile(dir + prefix + "train.lst");
		List<String> validateList = listLoader.loadListFromFile(dir + prefix + "validate.lst");
		List<String> testList = listLoader.loadListFromFile(dir + prefix + "test.lst");
		
		this.persistList(testList, formulas);
		this.persistList(trainList, formulas);
		this.persistList(validateList, formulas);
	}
	
	private void persistList(List<String> list, List<String> formulas) {
		for(String record:list) {
			String[] strArr = record.split(" ");
			//0 - index for formula, 1 -- filename
			int index = Integer.parseInt(strArr[0]);
			
			this.repository.save(new Employee("$" + formulas.get(index) + "$", strArr[1], strArr[1] + PNG));
		}
	}
	
	
}
// end::code[]