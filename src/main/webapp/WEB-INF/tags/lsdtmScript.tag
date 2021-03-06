<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib tagdir="/WEB-INF/tags" prefix="myTags" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<table style="width: 100%; table-layout: fixed;"><tr><td style="width:36px"><pre style="margin: 0; line-height: 125%; border:none; border-right: 1px solid #ccc;"> 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87</pre></td><td><pre id="lsdtm-script" style="margin: 0; line-height: 125%; border:none"><span style="color: #0099FF; font-style: italic">#!/bin/sh</span>

<span style="color: #006699; font-weight: bold">function </span>usage
<span style="color: #555555">{</span>
	<span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;usage: lsdtm.sh [[[-p Synthetic Population ID] [-o Output Directory]] | [-h Help]]&quot;</span>
	<span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;    This script will call a PSC PBS request to run FRED on the provided Synthetic Population ID.&quot;</span>
	<span style="color: #336666">echo</span>
<span style="color: #336666">	echo</span> <span style="color: #CC3300">&quot;-p, --population&quot;</span>
	<span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;    Synthetic Population ID&quot;</span>
	<span style="color: #336666">echo</span>
<span style="color: #336666">	echo</span> <span style="color: #CC3300">&quot;-f, --fips&quot;</span>
	<span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;    Override to use FIPS code as Synthetic Population ID&quot;</span>
	<span style="color: #336666">echo</span>
<span style="color: #336666">	echo</span> <span style="color: #CC3300">&quot;-C, --city&quot;</span>
	<span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;    Override to use city name as Synthetic Population ID&quot;</span>
	<span style="color: #336666">echo</span>
<span style="color: #336666">	echo</span> <span style="color: #CC3300">&quot;-c, --county&quot;</span>
	<span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;    Override to use county name as Synthetic Population ID&quot;</span>
	<span style="color: #336666">echo</span>
<span style="color: #336666">	echo</span> <span style="color: #CC3300">&quot;-s, --state&quot;</span>
	<span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;    Override to use state name as Synthetic Population ID&quot;</span>
	<span style="color: #336666">echo</span>
<span style="color: #336666">	echo</span> <span style="color: #CC3300">&quot;-o, --output_directory&quot;</span>
	<span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;    Directory where the output will be generated&quot;</span>
	<span style="color: #336666">echo</span>
<span style="color: #336666">	echo</span> <span style="color: #CC3300">&quot;-h, --help&quot;</span>
	<span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;    Display this help information&quot;</span>
	<span style="color: #336666">echo</span>
<span style="color: #555555">}</span>

<span style="color: #003333">base_dir</span><span style="color: #555555">=</span><span style="color: #006699; font-weight: bold">$(</span>dirname <span style="color: #CC3300">&quot;$0&quot;</span><span style="color: #006699; font-weight: bold">)</span>
<span style="color: #003333">population_type</span><span style="color: #555555">=</span><span style="color: #CC3300">&quot;synthetic_population_id&quot;</span>

<span style="color: #006699; font-weight: bold">while</span> <span style="color: #555555">[</span> <span style="color: #CC3300">&quot;$1&quot;</span> !<span style="color: #555555">=</span> <span style="color: #CC3300">&quot;&quot;</span> <span style="color: #555555">]</span>; <span style="color: #006699; font-weight: bold">do</span>
<span style="color: #006699; font-weight: bold">    case</span> <span style="color: #003333">$1</span> in
        -p | --population <span style="color: #555555">)</span>        <span style="color: #336666">shift</span>
<span style="color: #336666">                                   </span><span style="color: #003333">population_id</span><span style="color: #555555">=</span><span style="color: #003333">$1</span>
                                   ;;
	-f | --fips <span style="color: #555555">)</span>              <span style="color: #336666">shift</span>
<span style="color: #336666">				   </span><span style="color: #003333">population_type</span><span style="color: #555555">=</span><span style="color: #CC3300">&quot;fips&quot;</span>
				   ;;
	-C | --city <span style="color: #555555">)</span>              <span style="color: #336666">shift</span>
<span style="color: #336666">				   </span><span style="color: #006699; font-weight: bold">if</span> <span style="color: #555555">[</span> <span style="color: #003333">$population_type</span> !<span style="color: #555555">=</span> <span style="color: #CC3300">&quot;fips&quot;</span> <span style="color: #555555">]</span>; <span style="color: #006699; font-weight: bold">then</span>
<span style="color: #006699; font-weight: bold">				  	 </span><span style="color: #003333">population_type</span><span style="color: #555555">=</span><span style="color: #CC3300">&quot;city&quot;</span>
				   <span style="color: #006699; font-weight: bold">fi</span>
				   ;;
	-c | --county <span style="color: #555555">)</span>            <span style="color: #336666">shift</span>
<span style="color: #336666">				   </span><span style="color: #006699; font-weight: bold">if</span> <span style="color: #555555">[</span> <span style="color: #003333">$population_type</span> !<span style="color: #555555">=</span> <span style="color: #CC3300">&quot;city&quot;</span> <span style="color: #555555">]</span> <span style="color: #555555">&amp;&amp;</span> <span style="color: #555555">[</span> <span style="color: #003333">$population_type</span> !<span style="color: #555555">=</span> <span style="color: #CC3300">&quot;fips&quot;</span> <span style="color: #555555">]</span>; <span style="color: #006699; font-weight: bold">then</span>
<span style="color: #006699; font-weight: bold">				   	</span><span style="color: #003333">population_type</span><span style="color: #555555">=</span><span style="color: #CC3300">&quot;county&quot;</span>
				   <span style="color: #006699; font-weight: bold">fi</span>
				   ;;
	-s | --state <span style="color: #555555">)</span>             <span style="color: #336666">shift</span>
<span style="color: #336666">				   </span><span style="color: #006699; font-weight: bold">if</span> <span style="color: #555555">[</span> <span style="color: #003333">$population_type</span> <span style="color: #555555">==</span> <span style="color: #CC3300">&quot;synthetic_population_id&quot;</span> <span style="color: #555555">]</span>; <span style="color: #006699; font-weight: bold">then</span>
<span style="color: #006699; font-weight: bold">				   	</span><span style="color: #003333">population_type</span><span style="color: #555555">=</span><span style="color: #CC3300">&quot;state&quot;</span>
				   <span style="color: #006699; font-weight: bold">fi</span>
				   ;;
        -o | --output_directory <span style="color: #555555">)</span>  <span style="color: #336666">shift</span>
<span style="color: #336666">                                   </span><span style="color: #003333">output_directory</span><span style="color: #555555">=</span><span style="color: #003333">$1</span>
                                   ;;
        -h | --help <span style="color: #555555">)</span>              usage
                                   <span style="color: #336666">exit</span>
                                   ;;
        * <span style="color: #555555">)</span>                        usage
                                   <span style="color: #336666">exit </span>1
    <span style="color: #006699; font-weight: bold">esac</span>
<span style="color: #006699; font-weight: bold">    </span><span style="color: #336666">shift</span>
<span style="color: #006699; font-weight: bold">done</span>

<span style="color: #006699; font-weight: bold">if</span> <span style="color: #555555">[</span> ! -z <span style="color: #003333">$population_id</span> <span style="color: #555555">]</span>; <span style="color: #006699; font-weight: bold">then</span>
<span style="color: #006699; font-weight: bold">	if</span> <span style="color: #555555">[</span> ! -z <span style="color: #003333">$output_directory</span> <span style="color: #555555">]</span>; <span style="color: #006699; font-weight: bold">then</span>
<span style="color: #006699; font-weight: bold">		if</span> <span style="color: #555555">[</span> ! -d <span style="color: #003333">$output_directory</span> <span style="color: #555555">]</span>; <span style="color: #006699; font-weight: bold">then</span>
<span style="color: #006699; font-weight: bold">			</span>mkdir <span style="color: #003333">$output_directory</span>
		<span style="color: #006699; font-weight: bold">fi</span>
<span style="color: #006699; font-weight: bold">		</span>
<span style="color: #006699; font-weight: bold">		</span><span style="color: #336666">cd</span> <span style="color: #003333">$output_directory</span>
	<span style="color: #006699; font-weight: bold">fi</span>
<span style="color: #006699; font-weight: bold">	</span>
<span style="color: #006699; font-weight: bold">	if</span> <span style="color: #555555">[</span> <span style="color: #003333">$population_type</span> !<span style="color: #555555">=</span> <span style="color: #CC3300">&quot;synthetic_population_id&quot;</span> <span style="color: #555555">]</span>; <span style="color: #006699; font-weight: bold">then</span>
<span style="color: #006699; font-weight: bold">		</span><span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;Setting $population_id as $population_type&quot;</span>
	<span style="color: #006699; font-weight: bold">fi</span>
<span style="color: #006699; font-weight: bold">	</span>
<span style="color: #006699; font-weight: bold">	</span>qsub -v <span style="color: #003333">SYNTHETIC_POPULATION_ID</span><span style="color: #555555">=</span><span style="color: #CC3300">&quot;$population_id&quot;</span>,POPULATION_TYPE<span style="color: #555555">=</span><span style="color: #CC3300">&quot;$population_type&quot;</span> <span style="color: #003333">$base_dir</span>/spew2synthia_fred.pbs
<span style="color: #006699; font-weight: bold">else</span>
<span style="color: #006699; font-weight: bold">	</span>usage
	<span style="color: #006699; font-weight: bold">$(</span>&gt;&amp;2 <span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;Failed to provide Synthetic Population ID&quot;</span><span style="color: #006699; font-weight: bold">)</span>
	<span style="color: #006699; font-weight: bold">$(</span>&gt;&amp;2 <span style="color: #336666">echo</span> <span style="color: #CC3300">&quot;Aborted&quot;</span><span style="color: #006699; font-weight: bold">)</span>
<span style="color: #006699; font-weight: bold">fi</span>
</pre></td></tr></table>