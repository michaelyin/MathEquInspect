/**
 * 
 */
package net.wyun.hwe.inspection.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


/**
 * @author michael
 *
 */
@Component
@ConfigurationProperties("inspect")
public class InspectConfig {
	
	@Value("${inspection.source.directory}")
	private String srcDir;

	@Value("${inspection.target.directory}")
	private String targetDir;
	
	@Value("${inspection.image.server}")
	private String imageServer;

	public String getImageServer() {
		return imageServer;
	}

	public void setImageServer(String imageServer) {
		this.imageServer = imageServer;
	}

	public String getSrcDir() {
		return srcDir;
	}

	public void setSrcDir(String srcDir) {
		this.srcDir = srcDir;
	}

	public String getTargetDir() {
		return targetDir;
	}

	public void setTargetDir(String targetDir) {
		this.targetDir = targetDir;
	}
	
	

	
}
