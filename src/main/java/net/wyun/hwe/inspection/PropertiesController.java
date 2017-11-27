/**
 * 
 */
package com.greglturnquist.payroll;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.greglturnquist.payroll.config.InspectConfig;

/**
 * @author michael
 *
 */

@RestController
public class PropertiesController {
	
	private static final Logger logger = LoggerFactory.getLogger(PropertiesController.class);
	
	@Autowired
	private InspectConfig config;
	
	@RequestMapping(value="/imageserver", method=RequestMethod.GET)
	Map<String, String> getDiskUsage() {
		Map<String, String> map = new HashMap<String, String>();
		map.put("imageserver", config.getImageServer());
		return map;
	}
	
}
