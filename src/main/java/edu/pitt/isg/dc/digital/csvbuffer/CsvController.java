package edu.pitt.isg.dc.digital.csvbuffer;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsvController {
	
    @RequestMapping(value="/api/read-csv", produces="application/json")
    @ResponseBody
    public CSV readCSV(
    		@RequestParam("filename") String fileName,
    		@RequestParam("length") Long length,
    		@RequestParam("start") Long start,
    		@RequestParam("draw") Integer draw)
    				throws Exception{
        return new CsvReader().toCsv(fileName, start, length, draw);
    }

}
