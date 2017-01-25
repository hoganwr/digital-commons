#!/usr/bin/python

import sys
import pandas as pd
import json

def summaries(df):
	
	summary = {}
	
	summary['columns'] = list(df.columns)
	summary['recordsTotal'] = str(df.shape[0])

	summary['date_range'] = str(min(df.year)) + "-" + str(max(df.year))
	
	summary['week_no'] = {}
	summary['week_no']['min'] = str(min(df.week))
	summary['week_no']['max'] = str(max(df.week))
	
	summary['locations'] = {}
	summary['locations']['unique'] = str(df['loc'].unique().size)
	summary['locations']['unique_values'] = sorted(list(df['loc'].unique()))
	
	summary['states'] = {}
	summary['states']['unique'] = str(df['state'].unique().size)
	summary['states']['unique_values'] = sorted(list(df['state'].unique()))
	
	summary['location_types'] = {}
	summary['location_types']['unique'] = str(df['loc_type'].unique().size)
	summary['location_types']['unique_values'] = sorted(list(df['loc_type'].unique()))
	
	summary['country'] = {}
	summary['country']['unique'] = str(df['country'].unique().size)
	summary['country']['unique_values'] = sorted(list(df['country'].unique()))
	
	summary['counts'] = {}
	summary['counts']['min'] = str(df.number.min())
	summary['counts']['max'] = str(df.number.max())
	summary['counts']['std'] = str(df.number.std())
	summary['counts']['mean'] = str(df.number.mean())
	summary['counts']['median'] = str(df.number.median())
	
	summary['events'] = {}
	summary['events']['unique'] = df['event'].unique().size
	summary['events']['unique_values'] = list(df['event'].unique())
	
	return summary

def main(argv):
	
	filePath = argv
	df = pd.read_csv(filePath)
	result = {}
	meta = {}
	
	summary = summaries(df)
	
	result['meta'] = meta
	result['summary'] = summary
	
	print(json.dumps(result))
	return json.dumps(result)

if __name__ == "__main__":
   main(sys.argv[1])
	