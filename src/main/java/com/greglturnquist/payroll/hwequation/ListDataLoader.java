/**
 * 
 */
package com.greglturnquist.payroll.hwequation;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

/**
 * @author michael
 *
 */

@Component
public class ListDataLoader {
	
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
            e.printStackTrace();
        } 
        return arr;
	}

}
