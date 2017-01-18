package edu.pitt.isg.dc.digital.csvbuffer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsvController {
	
	@Autowired
	private CsvConfiguration conf;
	
    @RequestMapping(value="api/read-csv", produces="application/json")
    @ResponseBody
    public Object readCSV(
    		@RequestParam("filename") String fileName,
    		@RequestParam("length") Long length,
    		@RequestParam("start") Long start,
    		@RequestParam("draw") Integer draw)
    				throws Exception{
    	String filePath = conf.getFileDirectory() + fileName;
        return new CsvReader(fileName).readCSV(filePath, start, length, draw);
    }

}
