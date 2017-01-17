package edu.pitt.isg.dc.digital.csvbuffer;

import java.util.List;

public class CSV {
	private String title;
	private List<String> header;
	private List<List<String>> data;
	private Long recordsTotal;
	private Long recordsFiltered;
	private Integer draw;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Long getRecordsTotal() {
		return recordsTotal;
	}

	public void setRecordsTotal(Long recordsTotal) {
		this.recordsTotal = recordsTotal;
	}

	public List<List<String>> getData() {
		return data;
	}

	public void setData(List<List<String>> data) {
		this.data = data;
	}

	public List<String> getHeader() {
		return header;
	}

	public void setHeader(List<String> header) {
		this.header = header;
	}

	public Long getRecordsFiltered() {
		return recordsFiltered;
	}

	public void setRecordsFiltered(Long recordsFiltered) {
		this.recordsFiltered = recordsFiltered;
	}

	public Integer getDraw() {
		return draw;
	}

	public void setDraw(Integer draw) {
		this.draw = draw;
	}
}
