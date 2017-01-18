package edu.pitt.isg.dc.digital.csvbuffer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CsvConfiguration {

	@Value("${file.directory}")
	private String fileDirectory;

	public String getFileDirectory() {
		return fileDirectory;
	}

	public void setFileDirectory(String fileDirectory) {
		this.fileDirectory = fileDirectory;
	}

}