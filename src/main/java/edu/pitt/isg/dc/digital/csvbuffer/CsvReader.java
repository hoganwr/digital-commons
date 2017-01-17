package edu.pitt.isg.dc.digital.csvbuffer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.opencsv.CSVParser;

public class CsvReader {

	private Boolean withHeader = true;
	private String fileDirectory = "src/main/resources/data/test/";

	public CSV toCsv(String fileName, Long start, Long length, Integer draw) throws Exception {
		String filePath = fileDirectory + fileName;
		CSV csv = read(filePath, start, length, draw);
		csv.setTitle(fileName);
		return csv;
	}

	CSV read(String filePath, Long start, Long length, Integer draw) throws Exception {

		CSV csv = new CSV();

		Long recordsTotal = getRecordsTotal(filePath, withHeader);
		csv.setRecordsTotal(recordsTotal);

		if (withHeader) {
			List<String> header = getHeader(filePath);
			csv.setHeader(header);
		}

		List<List<String>> data = getData(filePath, length, start, withHeader);
		csv.setData(data);

		Long recordsFiltered = getRecordsFiltered(data, start);
		csv.setRecordsFiltered(recordsFiltered);

		csv.setDraw((int) draw);

		return csv;
	}

	private Long getRecordsFiltered(List<List<String>> data, Long start) {
		long recordsFiltered = 0;
		if (data.size() == 0)
			return recordsFiltered;
		recordsFiltered = start + data.size();
		return recordsFiltered;
	}

	private List<List<String>> getData(String filePath, Long length, Long start, Boolean withHeader)
			throws IOException, Exception {
		Stream<String> lines = Files.lines(Paths.get(filePath));
		long skip = start;
		if (withHeader)
			skip += 1;
		Stream<String> filtered = lines.skip(skip).limit(length);
		return parse(filtered::iterator);
	}

	private List<String> getHeader(String filePath) throws IOException {
		Stream<String> lines = Files.lines(Paths.get(filePath));
		return getHeaderLine(lines);
	}

	private Long getRecordsTotal(String filePath, Boolean withHeader) throws IOException {
		Stream<String> lines = Files.lines(Paths.get(filePath));
		long recordsTotal = lines.count();
		if (withHeader)
			recordsTotal -= 1;
		return recordsTotal;
	}

	private List<String> getHeaderLine(Stream<String> lines) throws IOException {
		String header = lines.findFirst().get();
		List<String> asList = Arrays.asList(new CSVParser().parseLine(header));
		return asList.stream().map(it -> it.trim()).collect(Collectors.toList());
	}

	private List<List<String>> parse(Iterable<String> iterable) throws Exception {

		List<List<String>> data = new ArrayList<>();
		CSVParser parser = new CSVParser();
		Iterator<String> it = iterable.iterator();
		List<String> line;
		while (it.hasNext()) {
			line = Arrays.asList(parser.parseLine(it.next()));
			data.add(line.stream().map(s -> s.trim()).collect(Collectors.toList()));
		}
		return data;
	}
}
