package edu.pitt.isg.dc.digital.csvbuffer;

import static org.assertj.core.api.BDDAssertions.then;

import java.util.Arrays;
import java.util.Map;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(/*classes = CsvConfiguration.class,*/ webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = { "management.port=0" })
public class TestCsvBuffer {

	@LocalServerPort
	private int port;

	// @Value("${local.management.port}")
	// private int mgt;

	@Autowired
	private TestRestTemplate testRestTemplate;
	private String fileDirectory = "src/main/resources/data/";
	private String fileName = "test.csv";
	private String filePath = fileDirectory + fileName;

	//@Test
	public void shouldReturn200WhenSendingRequestToController() throws Exception {
		@SuppressWarnings("rawtypes")
		ResponseEntity<Map> entity = this.testRestTemplate.getForEntity(
				"http://localhost:" + this.port + "/api/read-csv?filename=" + fileName + "&start=1&length=-1&draw=1",
				Map.class);

		then(entity.getStatusCode()).isEqualTo(HttpStatus.OK);
		then(entity.getBody().get("header")).asList().containsOnly("c1", "c2", "c3");
		then(entity.getBody().get("data")).asList().contains(Arrays.asList(new String[] {"1", "2", "3"}));
	}

	//@Test
	public void testReadCSV() throws Exception {
		Integer draw = 1;
		Long start = 15L;
		Long length = 10L;
		Long expectedTotal = 20L;
		Long expectedFiltered = 20L;
		int expectedSize = 5;
		CSV csv = new CsvReader(fileName).readCSV(filePath, start, length, draw);
		then(csv.getRecordsTotal()).isEqualTo(expectedTotal);
		then(csv.getRecordsFiltered()).isEqualTo(expectedFiltered);
		then(csv.getData().size()).isEqualTo(expectedSize);
		then(csv.getDraw()).isEqualTo(draw);

		start = 1L;
		length = 5L;
		expectedSize = 5;
		expectedFiltered = 20L;
		csv = new CsvReader(fileName).readCSV(filePath, start, length, draw);
		then(csv.getRecordsTotal()).isEqualTo(expectedTotal);
		then(csv.getRecordsFiltered()).isEqualTo(expectedFiltered);
		then(csv.getData().size()).isEqualTo(expectedSize);
		then(csv.getDraw()).isEqualTo(draw);
	}
	
	@Test
	public void testSummary(){
		String dir = "src/main/resources/data/";
		String fileName = "Measles_Cases_1980-1985.csv";
		String summary = (String) new CsvReader().summary(dir, fileName);
		System.out.println(summary);
	}
}