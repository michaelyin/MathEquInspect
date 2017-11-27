/**
 * 
 */
package net.wyun.hwe.inspection.hwequation;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * @author michael
 *
 */

@Component
public class ListDataLoader {
	
	private static final Logger logger = LoggerFactory.getLogger(ListDataLoader.class);
	
	public ListDataLoader() {
		super();
	}

	public ArrayList<String> loadListFromFile(String path){
		ArrayList<String> arr = new ArrayList<String>();
        try (BufferedReader br = new BufferedReader(new FileReader(path)))
        {

            String sCurrentLine;

            while ((sCurrentLine = br.readLine()) != null) {
                arr.add(sCurrentLine);
            }

        } catch (IOException e) {
        	logger.error("read " + path + " error", e);
        } 
        return arr;
	}

}
