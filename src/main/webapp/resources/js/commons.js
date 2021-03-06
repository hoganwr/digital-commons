/**
 * Created by jdl50 on 1/6/17.
 */
//https://github.com/jonmiles/bootstrap-treeview

//https://raw.githubusercontent.com/jonmiles/bootstrap-treeview/master/public/js/bootstrap-treeview.js
//https://rawgit.com/jonmiles/bootstrap-treeview/master/public/js/bootstrap-treeview.js

//https://raw.githubusercontent.com/jonmiles/bootstrap-treeview/master/public/css/bootstrap-treeview.css
//https://rawgit.com/jonmiles/bootstrap-treeview/master/public/css/bootstrap-treeview.css

// Dependencies
//Bootstrap v3.3.4 (>= 3.0.0)
//jQuery v2.1.3 (>= 1.9.0)
    
var dataAugmentedPublications = [];

var software = [];
var softwareDictionary = {};
var softwareSettings = {};

var systemsSoftware = [];
var systemsSoftwareDictionary = {};
var systemsSoftwareSettings = {};

var diseaseTransmissionModel = [];
var diseaseTransmissionModelDictionary = {};
var diseaseTransmissionModelSettings = {};

var modelingPlatforms = [];
var modelingPlatformsDictionary = {};
var modelingPlatformsSettings = {};

var statisticalAnalysis = [];
var statisticalAnalysisDictionary = {};
var statisticalAnalysisSettings = {};

var imageManipulation = [];
var imageManipulationDictionary = {};
var imageManipulationSettings = {};

var webservices = [];
var webservicesDictionary = {};
var webservicesSettings = {};

var geneticSequence = [];
var geneticSequenceDictionary = {};
var geneticSequenceSettings = {};

/* Change includes method in IE */
if(!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

function hardcodeFromJson(contextPath, location, treeArray, treeDictionary, treeSettings, treeviewTag, expandedInfo) {
    $.getJSON( contextPath + location + '?v=' + Date.now(), function( data ) {
        treeSettings = data["settings"];

        var name = treeSettings["name"];
        var directories = treeSettings["directories"];

        addTreeDirectories(directories, treeArray);
        addTreeNodes(name, data, treeDictionary, treeArray);
        buildBootstrapTree(name, contextPath, treeArray, treeviewTag, expandedInfo, treeDictionary);

        $('[data-toggle="tooltip"]').tooltip({
            trigger : 'hover',
            delay: 350
        });
    });
}

function addTreeDirectories(directories, treeArray) {
    for(var i = 0; i < directories.length; i++) {
        if(typeof directories[i] === 'string') {
            treeArray.push({
                "text": "<span class=\"root-break\" onmouseover='toggleTitle(this)'>" + directories[i] + "</span>",
                "nodes": [],
                "name": directories[i]
            });
        } else {
            var keys = Object.keys(directories[i]);
            var topDirectory = keys[0];
            var nodes = [];

            for(var x = 0; x < directories[i][topDirectory].length; x++) {
                nodes.push({
                    "text": "<span class=\"root-break\" onmouseover='toggleTitle(this)'>" + directories[i][topDirectory][x],
                    "nodes": [],
                    "name": directories[i][topDirectory][x]
                });
            }

            treeArray.push({
                "text": "<span class=\"root-break\" onmouseover='toggleTitle(this)'>" + topDirectory + "</span>",
                "nodes": nodes,
                "name": topDirectory
            });

        }
    }
}

function addTreeNodes(name, data, treeDictionary, treeArray) {
    for(var key in data) {
        treeDictionary[key] = data[key];

        if('directory' in treeDictionary[key]) {
            addNodesToDirectory(name, key, treeArray, treeDictionary);
        } else if(key != "settings" && key != "EpiCaseMap") {
            var nodeData = getNodeData(name, key, treeDictionary);
            nodeData["nodes"] = [];
            treeArray.push(nodeData);
        }
    }

    /*for(var key in data) {
        if(key != "settings") {
            treeDictionary[key] = data[key];

            treeArray.push({
                text: "<span data-placement='auto right' data-container='body' data-toggle='tooltip' title='" + treeDictionary[key]["description"] + "'>" + key + "</span>"
            });
        }
     }*/
}

function buildBootstrapTree(name, contextPath, treeArray, treeviewTag, expandedInfo, treeDictionary) {
    for(var i = 0; i < treeArray.length; i++) {
        if('nodes' in treeArray[i]) {
            treeArray[i].nodes.sort(compareNodes);
        }
    }

    if(name != "software") {
        treeArray.sort(compareNodes);
    }

    var treeviewInfo = {
        data: treeArray,
        showBorder: false,
        collapseAll: true,

        expandIcon: "glyphicon glyphicon-chevron-right",
        collapseIcon: "glyphicon glyphicon-chevron-down",

        onNodeSelected: function(event, data) {
            if(typeof data['nodes'] != undefined) {
                $(treeviewTag).treeview('toggleNodeExpanded', [data.nodeId, { levels: 1, silent: true } ]).treeview('unselectNode', [data.nodeId, {silent: true}]);
            }
            
            var expandedSoftware = $.parseJSON(sessionStorage.getItem(expandedInfo));

            if(data.state.expanded) {
                if(expandedSoftware != null) {
                    var index = expandedSoftware.indexOf(data.nodeId);
                    if (index > -1) {
                        expandedSoftware.splice(index, 1);
                    }
                }
            } else {
                if(expandedSoftware != null) {
                    var index = expandedSoftware.indexOf(data.nodeId);
                    if (index <= -1) {
                        expandedSoftware.push(data.nodeId);
                    }
                } else {
                    expandedSoftware = [];
                    expandedSoftware.push(data.nodeId);
                }
            }

            sessionStorage.setItem(expandedInfo, JSON.stringify(expandedSoftware));


            if(data.url != null && data.state.selected == true) {
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'Clickthrough',
                    eventAction: data.url
                });

                if('signInRequired' in data && data['signInRequired'] == true) {
                    $(location).attr('href', contextPath + "/midas-sso/view?url=" + encodeURIComponent(data.url));
                } else {
                    window.location.href = data.url;
                }
            }
        }
    };

    if(name == "diseaseTransmissionModels" || name == "systemSoftware" || name == "tools") {
        treeviewInfo['expandIcon'] = "bullet-point	";
        treeviewInfo['collapseIcon'] = "bullet-point	";
        treeviewInfo['highlightSelected'] = false;
        treeviewInfo['onNodeSelected'] = function(event, data) {
            $('[data-toggle="tooltip"]').tooltip('destroy');
            event.stopPropagation();
        };
        $(treeviewTag).treeview(treeviewInfo);
        $(treeviewTag).treeview('expandAll', { silent: true });
    } else {
        if(name == "webServices") {
            treeviewInfo['expandIcon'] = "bullet-point	";
            treeviewInfo['collapseIcon'] = "bullet-point	";
        }
        $(treeviewTag).treeview(treeviewInfo);
        $(treeviewTag).treeview('collapseAll', { silent: true });
    }

    /*if(name != "software" && name != "tools" && name != "diseaseTransmissionModels" && name != "systemSoftware") {
     treeviewInfo['emptyIcon'] = "bullet-point	";
     }*/

    var expandedSoftware = $.parseJSON(sessionStorage.getItem(expandedInfo));
    var toRemove = [];

    if(expandedSoftware == null && "settings" in treeDictionary) {
        var openByDefault = treeDictionary["settings"]["openDirectories"];
        var openByDefaultIds = [];
        for(var i = 0; i < openByDefault.length; i++) {
            var matchingNode = $(treeviewTag).treeview('search', [ openByDefault[i], {
                ignoreCase: false,     // case insensitive
                exactMatch: false,    // like or equals
                revealResults: false  // reveal matching nodes
            }])[0];
            $(treeviewTag).treeview('clearSearch');
            if(matchingNode != null) {
                openByDefaultIds.push(matchingNode.nodeId);
            }
        }

        expandedSoftware = openByDefaultIds;
        sessionStorage.setItem(expandedInfo, JSON.stringify(openByDefaultIds));
    }

    if(expandedSoftware != null) {
        for(var i = 0; i < expandedSoftware.length; i++) {
            try {
                $(treeviewTag).treeview('expandNode', [ expandedSoftware[i], { silent: true } ]);
            } catch(err) {
                toRemove.push(i);
            }
        }

        if(toRemove.length > 0) {
            for(var i = 0; i < toRemove.length; i++) {
                expandedSoftware.splice(toRemove[i], 1);
            }

            sessionStorage.setItem(expandedInfo, JSON.stringify(expandedSoftware));
        }
    }
}

function addNodesToDirectory(name, key, treeArray, treeDictionary) {
    for(var i = 0; i < treeArray.length; i++) {
        var subdirectories = [];
        var subdirectoryContent = [];

        addNodesToSubdirectories(treeArray[i], subdirectories, subdirectoryContent);

        var index = subdirectories.indexOf(treeDictionary[key]['subdirectory']);

        if(treeArray[i]['name'] == treeDictionary[key]['directory'] || index > -1) {
            var nodeData = getNodeData(name, key, treeDictionary);

            /* Add node to directory or subdirectory */
            if(index > -1) {
                subdirectoryContent[index].nodes.push(nodeData);
                subdirectoryContent[index].nodes.sort(compareNodes);
            } else {
                treeArray[i].nodes.push(nodeData);
            }

            break;
        }
    }
}

function addNodesToSubdirectories(treeArrayItem, subdirectories, subdirectoryContent) {
    if('nodes' in treeArrayItem) {
        for(var x in treeArrayItem['nodes']) {
            if('nodes' in treeArrayItem['nodes'][x]) {
                subdirectories.push(treeArrayItem['nodes'][x]['name']);
                subdirectoryContent.push(treeArrayItem['nodes'][x]);
            }
        }
    }
}

function getNodeData(name, key, treeDictionary) {
    var title = key;
    if('version' in treeDictionary[key]) {
        title = getSoftwareTitle(key, treeDictionary[key]['version'].join(', '));
    } else if(title.includes('/') && name != "software" && name != "webServices") {
        //var titleAndVersion = title.split('/');
        //title = getSoftwareTitle(titleAndVersion[0], titleAndVersion[1]);
    }

    var nodeData = {
        'text': '<span onmouseover="toggleTitle(this)" onclick="openModal(\'' + name + '\',' + '\'' + key + '\')">' + title + '</span>',
        'name': key
    };

    if('availableAt' in treeDictionary[key]) {
        for(var i = 0; i < treeDictionary[key]["availableAt"].length; i++) {
            if(treeDictionary[key]["availableAt"][i] == "udsi") {
                nodeData.text += ' <b><i class="udsi-color"><sup>UDSI</sup></i></b>';
            }

            if(treeDictionary[key]["availableAt"][i] == "olympus") {
                nodeData.text += ' <b><i class="olympus-color"><sup>RROO</sup></i></b>';
            }
        }
    }

    if('signInRequired' in treeDictionary[key] && treeDictionary[key]['signInRequired'] == true) {
        nodeData.text += ' <b><i class="sso-color"><sup>SSO</sup></i></b>';
    }

    if('redirect' in treeDictionary[key] && treeDictionary[key]['redirect'] == true) {
        var url = '';
        if('source' in treeDictionary[key]) {
            url = treeDictionary[key]['source'];
        }

        if('site' in treeDictionary[key]) {
            url = treeDictionary[key]['site'];
        }

        if(url.length > 0) {
            nodeData['url'] = url;
            nodeData['text'] = '<span onmouseover="toggleTitle(this)">' + title + '</span>';

            if('availableAt' in treeDictionary[key]) {
                for(var i = 0; i < treeDictionary[key]["availableAt"].length; i++) {
                    if(treeDictionary[key]["availableAt"][i] == "udsi") {
                        nodeData.text += ' <b><i class="udsi-color"><sup>UDSI</sup></i></b>';
                    }

                    if(treeDictionary[key]["availableAt"][i] == "olympus") {
                        nodeData.text += ' <b><i class="olympus-color"><sup>RROO</sup></i></b>';
                    }
                }
            }

            if('signInRequired' in treeDictionary[key] && treeDictionary[key]['signInRequired'] == true) {
                nodeData.text += ' <b><i class="sso-color"><sup>SSO</sup></i></b>';
                nodeData['signInRequired'] = treeDictionary[key]['signInRequired'];
            }
        }
    }

    if(name != "software" && name != "webServices") {
        nodeData.text = "<span data-placement='auto right' data-container='body' data-toggle='tooltip' title='" + treeDictionary[key]["description"] + "'>" + title + "</span>";
    }

    return nodeData;
}

function getSoftwareTitle(name, version) {
    var title = name;

    var splitTitle = title.split(' ');
    var titleEnd = splitTitle[splitTitle.length - 1];
    if(titleEnd.length == 3 && titleEnd.startsWith('[') && titleEnd.endsWith(']')) {
        title = splitTitle.slice(0, splitTitle.length - 1).join(' ');
    }

    version = version.split(' - ')[0];
    if(isNaN(version[0])) {
        title += ' - ' + version;
    } else {
        title += ' - v' + version;
    }
    return title;
}

var standardEncodingTree = {
    text: "Standards for encoding data",
    nodes: [
        {
            text: "<span onmouseover='toggleTitle(this)'>LOINC codes (for lab tests)</span>",
            url: "http://loinc.org/"
        },
        {
            text: "<span onmouseover='toggleTitle(this)'>NCBI Taxon identifiers (for host and pathogen taxa)</span>",
            url: "https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi"
        },
        {
            text: "<span onmouseover='toggleTitle(this)'>RxNorm codes (for drugs)</span>",
            url: "https://www.nlm.nih.gov/research/umls/rxnorm/"
        },
        {
            text: "<span onmouseover='toggleTitle(this)'>SNOMED CT codes (for diagnoses)</span>",
            url: "https://nciterms.nci.nih.gov/ncitbrowser/pages/vocabulary.jsf?dictionary=SNOMED%20Clinical%20Terms%20US%20Edition"
        },
        {
            text: "<span onmouseover='toggleTitle(this)'>Vaccine Ontology identifiers (for vaccines)</span>",
            url: "http://www.violinet.org/vaccineontology/"
        },
        {
            text: "<span onmouseover='toggleTitle(this)'>Apollo XSD (for standard data types)</span>",
            url: "https://github.com/ApolloDev/apollo-xsd-and-types"
        },
        {
            text: "<span onmouseover='toggleTitle(this)'>Apollo Location Codes (for locations) <b><i class='sso-color'><sup>SSO</sup></i></b></span>",
            url: "https://betaweb.rods.pitt.edu/ls"
        }
    ]
};

function getDataAndKnowledgeTree(libraryData, syntheticEcosystems, libraryViewerUrl, contextPath) {
    var collections = [];
    libraryViewerUrl = libraryViewerUrl + "main/";

    collections.push(
        syntheticEcosystems,
        {
            text: "Synthia™ synthetic populations",
            nodes: [
                {
                    text: "2010 U.S. Synthetic Populations by County",
                    url:"http://www.epimodels.org/drupal/?q=node/81"
                },
                {
                    text: "2010 U.S. Synthetic Populations by State",
                    url:"http://www.epimodels.org/drupal/?q=node/80"
                }
            ]
        },
        {
            text: "Disease surveillance data",
            nodes: [
                {
                    text: "<span onmouseover='toggleTitle(this)'>Brazil Ministry of Health</span>",
                    url:"http://www2.datasus.gov.br/DATASUS/index.php?area=0203"
                },
                {
                    text: "<span onmouseover='toggleTitle(this)'>CDCEpi Zika Github</span>",
                    url:"https://zenodo.org/record/192153#.WIEKNLGZNcA"
                },
                {
                    text: "<span onmouseover='toggleTitle(this)'>Colombia Ministry of Health</span>",
                    url:"http://www.ins.gov.co/lineas-de-accion/Subdireccion-Vigilancia/sivigila/Paginas/vigilancia-rutinaria.aspx"
                },
                {
                    text: "<span onmouseover='toggleTitle(this)'>Singapore Ministry of Health</span>",
                    url:"https://www.moh.gov.sg/content/moh_web/home/diseases_and_conditions.html"
                },
                {
                    text: "<span onmouseover='toggleTitle(this)'>US notifiable diseases</span>",
                    nodes: [
                        {
                            text: "<span onmouseover='toggleTitle(this)'>MMWR morbidity and mortality tables through data.cdc.gov</span>",
                            url:"https://data.cdc.gov/browse?category=MMWR"
                        },

                        {
                            text: "<span onmouseover='toggleTitle(this)'>Tycho level 1</span>",
                            url:"https://www.tycho.pitt.edu/data/level1.php"
                        },
                        {
                            text: "<span onmouseover='toggleTitle(this)'>Tycho level 2</span>",
                            url:"https://www.tycho.pitt.edu/data/level2.php"
                        },
                    ]
                },
            ]
        },
        {
            text: "Mortality data",
            nodes: [

                {
                    text: "<span onmouseover='toggleTitle(this)'>CDC WONDER US cause of death 1995-2015</span>",
                    url: "https://wonder.cdc.gov/controller/datarequest/D76"
                },
                {
                    text: "<span onmouseover='toggleTitle(this)'>CDC WONDER US compressed mortality files</span>",
                    url: "https://wonder.cdc.gov/mortSQL.html"
                }
            ]
        }
    );


    if(libraryData != null) {
        $.each(libraryData, function (index, value) {
            var url;
            if (index.includes("Epidemic")) {
                url = libraryViewerUrl + "epidemic/";
            } else if (index.includes("Case series")) {
                url = libraryViewerUrl + "caseSeries/"
            } else {
                url = libraryViewerUrl + "infectiousDiseaseScenario/";
            }
            var nodeLevel1 = [];
            $.each(value, function (index, value) {
                var nodeLevel2 = [];
                $.each(value, function (index, value) {
                    //var externalbutton = "<button type='button'  id='" + url+value.urn + "'  class='btn btn-primary pull-right' onclick='openViewer(this.id)'>" +
                    //     "<i class='fa fa-external-link'></i></button>";
                    //var modalbutton = "<button type='button'  id='" + url+value.urn + "'  class='btn btn-primary pull-right' onclick='openModal(this.id)'>" +
                    //     "<i class='fa fa-info-circle'></i></button>";

                    nodeLevel2.push({
                        text: "<span>" + value.name + " <b><i class=\"ae-color\"><sup>AE</sup></i><b> <b><i class='sso-color'><sup>SSO</sup></i></b></span> ",
                        url: url + value.urn
                    });
                });
                if(index.includes("Zika") || index.includes("Chikungunya")) {
                    index += " (under development)";
                }
                if(index.includes("H1n1 infectious disease scenarios"))
                    index = "H1N1 infectious disease scenarios";
                nodeLevel1.push({text: index + " <b><i class=\"ae-color\"><sup>AE</sup></i><b> <b><i class='sso-color'><sup>SSO</sup></i></b><span>", nodes: nodeLevel2});
            });

            collections.push({text: index, nodes: nodeLevel1});

        });
    }

    collections.push(standardEncodingTree);

    return collections;
}

function openViewer(url) {
    window.open(url);
}

function toggleModalItem(key, attrs, name, hasHref, renderHtml) {
    if(key in attrs) {
        var attribute = attrs[key];
        if(Object.prototype.toString.call( attribute ) === '[object Array]') {
            if(attribute[0].includes("<ul") || attribute[0].includes("<br>")) {
                attribute = attribute.join('');
            } else {
                attribute = attribute.join(', ');
            }
        }

        $('#software-' + name + '-container').show();

        if(renderHtml) {
            $('#software-' + name).html(attribute);
        } else {
            $('#software-' + name).text(attribute);
        }

        if(hasHref) {
            $('#software-' + name).attr('href', attribute);
        }
    } else {
        $('#software-' + name + '-container').hide();
    }
}

function toggleRequiredModalItem(key, attrs, name, hasHref, renderHtml, type) {
    if(key in attrs) {
        var attribute = attrs[key];
        if(Object.prototype.toString.call( attribute ) === '[object Array]') {
            attribute = attribute.join(', ');
        }

        $('#software-' + name + '-container').show();

        if(renderHtml) {
            $('#software-' + name).html(attribute);
        } else {
            $('#software-' + name).text(attribute);
        }

        if(hasHref) {
            $('#software-' + name).attr('href', attribute);
        }
    } else if(type == 'software') {
        $('#software-' + name + '-container').show();
        if(key == 'dataInputFormats' || key == 'dataOutputFormats') {
            $('#software-' + name).html('Proprietary');
        } else {
            $('#software-' + name).html('N/A');
        }
    } else {
        $('#software-' + name + '-container').hide();
    }
}

function openModal(type, name) {
    var attrs = {};
    if(type == 'software') {
        attrs = softwareDictionary[name];

        ga('send', {
            hitType: 'event',
            eventCategory: 'User Activity',
            eventAction: 'Software - ' + name
        });
    } else if(type == 'webServices') {
        attrs = webservicesDictionary[name];

        ga('send', {
            hitType: 'event',
            eventCategory: 'User Activity',
            eventAction: 'Web Services - ' + name
        });
    }

    if(name != null) {
        $('#software-name').show();
        if('version' in attrs) {
            $('#software-name').text(getSoftwareTitle(name, attrs['version'].join(', ')));
        } else {
            $('#software-name').text(name);
        }
    } else {
        $('#software-name').hide();
    }

    if('developer' in attrs) {
        var attribute = attrs['developer'];
        var length = attribute.length;

        attribute = attribute.join(', ');

        $('#software-developer-container').show();
        $('#software-developer').html(attribute);

        if(length > 1) {
            $('#software-developer-tag').text('Developers:');
        } else {
            $('#software-developer-tag').text('Developer:');
        }
    } else {
        $('#software-developer-container').hide();
    }

    if('version' in attrs) {
        var attribute = attrs['version'];
        var length = attribute.length;

        attribute = attribute.join(', ');

        $('#software-version-container').show();
        $('#software-version').text(attribute);

        if(length > 1 && type == 'software') {
            $('#software-version-tag').text('Software versions:');
        } else {
            $('#software-version-tag').text('Software version:');
        }

        if(length > 1 && type == 'webServices') {
            $('#software-version-tag').text('Versions:');
        } else {
            $('#software-version-tag').text('Version:');
        }
    } else {
        $('#software-version').text('N/A');
    }

    toggleRequiredModalItem('doi', attrs, 'doi', false, true, type);

    toggleRequiredModalItem('dataInputFormats', attrs, 'data-input-formats', false, false, type, true);

    toggleRequiredModalItem('dataOutputFormats', attrs, 'data-output-formats', false, false, type, true);

    toggleModalItem('type', attrs, 'type', false, false);

    toggleModalItem('populationSpecies', attrs, 'population-species', false, false);

    toggleModalItem('source', attrs, 'source-code', true, false);

    toggleModalItem('pathogenCoverage', attrs, 'pathogen-coverage', false, false);

    toggleModalItem('locationCoverage', attrs, 'location-coverage', false, false);

    toggleModalItem('speciesIncluded', attrs, 'species-included', false, false);

    toggleModalItem('hostSpeciesIncluded', attrs, 'host-species-included', false, false);

    toggleModalItem('controlMeasures', attrs, 'control-measures', false, false);

    toggleModalItem('title', attrs, 'title', false, false);

    toggleModalItem('generalInfo', attrs, 'general-info', false, true);

    toggleModalItem('sourceCodeRelease', attrs, 'source-code-release', false, true);

    toggleModalItem('publicationsAboutRelease', attrs, 'publications-about-release', false, true);

    toggleModalItem('publicationsThatUsedRelease', attrs, 'publications-that-used-release', false, true);

    toggleModalItem('webApplication', attrs, 'web-application', true, false);

    toggleModalItem('userGuidesAndManuals', attrs, 'user-guides-and-manuals', true, false);

    toggleModalItem('executables', attrs, 'executables', false, true);

    toggleModalItem('license', attrs, 'license', false, true);

    toggleModalItem('endpointPrefix', attrs, 'end-point-prefix', true, false);

    toggleModalItem('documentation', attrs, 'documentation', false, true);

    toggleModalItem('restDocumentation', attrs, 'rest-documentation', true, false);

    toggleModalItem('soapDocumentation', attrs, 'soap-documentation', true, false);

    toggleModalItem('soapEndpoint', attrs, 'soap-endpoint', true, false);

    toggleModalItem('projectSource', attrs, 'project-source-code', true, false);

    toggleModalItem('soapSource', attrs, 'rest-source-code', true, false);

    toggleModalItem('restSource', attrs, 'soap-source-code', true, false);

    toggleModalItem('exampleQueries', attrs, 'example-queries', false, true);

    toggleModalItem('diseases', attrs, 'diseases', false, false);

    toggleModalItem('region', attrs, 'region', false, true);

    toggleModalItem('outcomes', attrs, 'outcomes', false, true);

    toggleModalItem('forecasts', attrs, 'forecasts', false, true);

    toggleModalItem('nowcasts', attrs, 'nowcasts', false, true);

    toggleModalItem('site', attrs, 'site', true, false);

    toggleModalItem('forecastFrequency', attrs, 'forecast-frequency', false, false);

    toggleModalItem('visualizationType', attrs, 'visualization-type', false, false);

    toggleModalItem('grant', attrs, 'grant', false, false);

    toggleModalItem('platform', attrs, 'platform', false, false);

    $('#pageModal').modal('show');

}

function formatLocation(location) {
    if(location.includes('_')) {
        var splitLocationNames = location.split('_');
    } else {
        var splitLocationNames = location.split(' ');
    }

    for(var i = 0; i < splitLocationNames.length; i++) {
        var characterIndex = 0;
        if(splitLocationNames[i].charAt(0) == '(') {
            characterIndex = 1;
        }

        if(splitLocationNames[i].replace(/["'\(\)]/g, "") != 'of') {        // remove parentheses and check for 'of'
            splitLocationNames[i] = splitLocationNames[i].charAt(characterIndex).toUpperCase() + splitLocationNames[i].slice(characterIndex + 1);

            if(characterIndex == 1) {       // add back leading parentheses if we removed it
                splitLocationNames[i] = '(' + splitLocationNames[i];
            }
        }
    }

    return splitLocationNames.join(' ');
}

function openSoftwareInfo(contextPath, id) {
    location.href = contextPath + "/main/software/" + id;
}

function openLibraryFrame(url) {
    document.getElementById("libraryFrame").parentNode.style.display='';
    document.getElementById("commons-main-body").style.display='none';
    document.getElementById("commons-main-tabs").style.display='none';

    window.open(url, "libraryFrame");
}

function collapsableNode(contextPath, title, text) {
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    return '<div id="' + guid + '-panel" class="panel panel-default" style="margin-bottom: 0">' +
        '<div class="panel-heading" role="tab" id="' + guid + '-heading" style="padding:1px 3px">' +
        '<span class="panel-title" style="font-size:12px;">' +
        '<a role="button" data-toggle="collapse" data-parent="#accordion" aria-expanded="false" aria-controls="' + guid + '-collapse" style="text-decoration: none">' +
        title + '</a></span></div><div id="' + guid + '-collapse" class="panel-collapse collapse" role="tabpanel" aria-labelledby="' + guid + '-heading">' +
        '<div class="panel-body" style="padding:1px 3px; font-size:12px">' + text + '<img src = "' + contextPath + '/resources/img/fred.png' + '" style="max-width:100%; max-height:100%;">' + '</div></div></div>' + '<script>' +
        '$("#' + guid + '-panel").hover(function() {$("#' + guid + '-collapse").collapse("show");}, function() {$("#' + guid + '-collapse").collapse("hide");}); </script>';
}

function getPopover(imgPath, title, modalImgPath, softwareName) {
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    var img = "'<img src = \"" + imgPath + "\" id = \"" + guid +"-img\" style=\"max-width:100%; min-height:150px\">'";

    return '<span id="' + guid + '" class="bs-popover">' + title + '</span>' + '<script>$("#' + guid + '-img").click(function(){openModal("' + softwareName + '")});$("#' + guid + '").popover({container: "body", html: true, trigger: "click", content: function() {return ' + img + '}}).on("show.bs.popover", function(e){$("[rel=popover]").not(e.target).popover("destroy");$(".popover").remove();});</script>';
}

function compareNodes(a,b) {
    if (a.name.trim().toLowerCase() < b.name.trim().toLowerCase())
        return -1;
    if (a.name.trim().toLowerCase() > b.name.trim().toLowerCase())
        return 1;
    return 0;
}

function toggleTitle(element) {
    var $this = $(element);

    if($this[0].parentNode.offsetWidth < $this[0].parentNode.scrollWidth || $this[0].offsetWidth < $this[0].scrollWidth){
        $this.attr('title', $this.text());
    } else {
        $this.attr('title', '');
    }
}

function activeTab(tab) {
    $('.tabs a[href="#' + tab + '"]').tab('show');
    location.hash = tab;

    if(!tab.includes('publication')) {
        $('#data-and-knowledge-tab').removeClass('highlighted-item');
    } else {
        $('#data-and-knowledge-tab').addClass('highlighted-item');
    }
}

function getWebServicesTreeview() {
    var collections = [];
    collections.push(
        {
            text: "WebServices placeholder",
            nodes: []
        }
    );
    return collections;
}

function getSoftwareEnvironmentTreeview() {
    var collections = [];
    collections.push(
        {
            text: "Software environment placeholder",
            nodes: []
        }
    );
    return collections;
}

function getDiseaseTransmissionModelTreeview() {
    var collections = [];
    collections.push(
        {
            text: "Disease transmission model placeholder",
            nodes: []
        }
    );
    return collections;
}

function getToolsTreeview() {
    var collections = [];
    collections.push(
        {
            text: "Statistical analysis software"
        },
        {
            text: "Image manipulation"
        }
    );
    return collections;
}

$('#commons-body').on('click', function (e) {
    //did not click a popover toggle or popover
    if ($(e.target).attr('class') !== 'bs-popover') {
        $("[rel=popover]").not(e.target).popover("destroy");
        $(".popover").remove();
    }

    /*if($(e.target).attr('data-toggle') == 'tab') {
     if($(e.target).attr('href') == '#data-and-knowledge') {
     $('#data-and-knowledge-tab').addClass('highlighted-item');
     } else {
     $('#data-and-knowledge-tab').removeClass('highlighted-item');
     }
     }*/
    //$('[data-toggle="tooltip"]').not(e.target).popover("destroy");
    $('[data-toggle="tooltip"]').tooltip({trigger : 'hover', delay: 350});
});

$(document).ready(function() {
    if (location.hash) {
        $("a[href='" + location.hash + "']").tab("show");

        if(location.hash == "#workflows") {
            setTimeout(function(){drawDiagram()}, 300);
        }

        var elementText = $("a[href='" + location.hash + "']").text();

        if(elementText == '') {
            elementText = 'Data-augmented Publication';
        }

        ga('send', {
            hitType: 'pageview',
            page: location.pathname,
            title: elementText
        });

        if(location.hash.includes('publication')) {
            $('#content-tab').addClass('highlighted-item');
        }
    } else {
        ga('send', {
            hitType: 'pageview',
            page: location.pathname,
            title: 'Content'
        });
    }

    $(document.body).on("click", "a[data-toggle]", function(event) {
        location.hash = this.getAttribute("href");
        ga('send', {
            hitType: 'pageview',
            page: location.pathname,
            title: $(this).text()
        });
    });

    $(document.body).on("click", "a", function(event) {
        var href = this.getAttribute("href");

        if(href.includes('http')) {
            ga('send', {
                hitType: 'event',
                eventCategory: 'Clickthrough',
                eventAction: href
            });
        }
    });
});

$(window).on("popstate", function() {
    var anchor = location.hash || $("a[data-toggle='tab']").first().attr("href");
    $("a[href='" + anchor + "']").tab("show");

    if(location.hash.includes('publication')) {
        $('#content-tab').addClass('highlighted-item');
    } else {
        $('#content-tab').removeClass('highlighted-item');
    }
});

function init() {
    var vidDefer = document.getElementsByTagName('iframe');
    for (var i=0; i<vidDefer.length; i++) {
        if(vidDefer[i].getAttribute('data-src')) {
            vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
        } } }
window.onload = init;

function convertDateNumToString(num) {
    if(num < 10) {
        num = '0' + num;
    } else {
        num += ''
    }

    return num;
}

function getFormattedDate() {
    var date = new Date();
    var year = date.getYear()-100;
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    year = convertDateNumToString(year);
    month = convertDateNumToString(month);
    day = convertDateNumToString(day);
    minutes = convertDateNumToString(minutes);
    seconds = convertDateNumToString(seconds);

    var formattedDate = year + month + day + minutes + seconds;

    return formattedDate;
}

function drawDiagram() {
    /*var synthpop = $('input[name=synthpop]:checked').val();
    var dtm = $('input[name=dtm]:checked').val();

    var operationNum = 1;
    var toParse = '';
    if(synthpop == 'spew') {
        toParse = 'op' + operationNum + '=>operation: SPEW:>\n';
        operationNum++;

        toParse += 'op' + operationNum + '=>operation: SPEW.US to Synthia.US translator\n';
        operationNum++;
    } else if(synthpop == 'synthia') {
        toParse = 'op' + operationNum + '=>operation: Synthia:>\n';
        operationNum++;
    } else {
        return;
    }

    if(dtm == 'pfred') {
        toParse += 'op' + operationNum + '=>operation: pFRED DTM:>\n';
        operationNum++;
    } else if(dtm == 'flute') {
        toParse += 'op' + operationNum + '=>operation: FluTE DTM:>\n';
        operationNum++;
    }

    for(var i = 1; i < operationNum + 1; i++) {
        toParse += 'op' + i;

        if(i != operationNum) {
            toParse += '->';
        }
    }

    $('#workflow-diagram-label').text('Workflow Diagram');
    $('#workflow-diagram').html('');
    var diagram = flowchart.parse(toParse);
    diagram.drawSVG('workflow-diagram');*/

    var synthpop = $('input[name=synthpop]:checked').val();
    var dtm = $('input[name=dtm]:checked').val();
    var olympusUsername =$('#olympus-username').val();

    var locationValues = $('#location-select').val().split('_');
    var formattedLocation = formatLocation(locationValues[0]);
    var locationCode = locationValues[1];

    /*var toParse = '';
    if(synthpop == 'spew') {
        toParse = 'cond=>condition: Population|popgreen\n' +
            'op2=>operation: Synthia.US format\n'+
            'op3=>operation: SPEW.US format|green\n'+
            'op4=>operation: SPEW.US to Synthia.US translator|green\n';

        if(dtm == 'fred') {
            toParse += 'op5=>operation: FRED DTM|green\n';
        } else {
            toParse += 'op5=>operation: FRED DTM\n';
        }

        toParse += 'cond(yes)->op3->op4->op5\n'+
            'cond(no)->op2->op5\n';

    } else if(synthpop == 'synthia') {
        toParse = 'cond=>condition: Population|popgreen\n' +
            'op2=>operation: Synthia.US format|green\n'+
            'op3=>operation: SPEW.US format\n'+
            'op4=>operation: SPEW.US to Synthia.US translator\n';

        if(dtm == 'fred') {
            toParse += 'op5=>operation: FRED DTM|green\n';
        } else {
            toParse += 'op5=>operation: FRED DTM\n';
        }

        toParse += 'cond(yes)->op3->op4->op5\n'+
            'cond(no)->op2->op5\n';

    } else {
        toParse = 'cond=>condition: Population\n' +
            'op2=>operation: Synthia.US format\n'+
            'op3=>operation: SPEW.US format\n'+
            'op4=>operation: SPEW.US to Synthia.US translator\n'+
            'op5=>operation: FRED DTM\n'+
            'cond(yes)->op3->op4->op5\n'+
            'cond(no)->op2->op5\n';
    }

    $('#workflow-diagram-label').text('Workflow Diagram');
    $('#workflow-diagram').html('');

    var diagram = flowchart.parse(toParse);
    diagram.drawSVG('workflow-diagram', {
        'x': 0,
        'y': 0,
        'line-width': 3,
        'line-length': 50,
        'text-margin': 10,
        'font-size': 14,
        'font-color': 'black',
        'line-color': 'black',
        'element-color': 'black',
        'fill': 'white',
        'yes-text': 'SPEW',
        'no-text': 'Synthia',
        'arrow-end': 'block',
        'scale': 1,
        'flowstate' : {
            'dtm': {'yes-text' : 'SPEW', 'no-text' : 'Synthia'},
            'popgreen': {'fill': 'lightgreen', 'yes-text' : 'SPEW', 'no-text' : 'Synthia'},
            'green': {'fill': 'lightgreen'}
        }
    });*/

    if(locationCode != null && synthpop != null && dtm != null) {
        /*jQuery.get(ctx + '/resources/lsdtm-script-example.txt', function(data) {
            //$('#lsdtm-script').text(data);
            $('#run-lsdtm-script').text(
                'ssh <username>@olympus.psc.edu\n' +
                '/mnt/lustre0/data/shared_group_data/syneco/spew2synthia/scripts/lsdtm.sh spew_1.2.0_'
                + locationCode);

            $('#lsdtm-script-container').show();
        });*/

        var username = "<username>";
        if(olympusUsername != null && olympusUsername.trim() != '') {
            username = olympusUsername;
        }

        var outputDirectory = locationCode + "_" + dtm + "_" + getFormattedDate();

        $('#submit-lsdtm-script').text("/mnt/lustre0/data/shared_group_data/syneco/spew2synthia/scripts/lsdtm.sh -p spew_1.2.0_" + locationCode + " -o " + outputDirectory);
        $('#example-submit-lsdtm-script').text("-bash-4.2$ /mnt/lustre0/data/shared_group_data/syneco/spew2synthia/scripts/lsdtm.sh -p spew_1.2.0_" +
            locationCode + " -o /home/" + username + "/test\n557925.pbs.olympus.psc.edu");

        $('#status-lsdtm-script').text("qstat | grep " + username);
        $('#example-status-lsdtm-script').text("-bash-4.2$ qstat | grep " + username + "\n557925.pbs.olympus.psc.edu ..._spew2synthia " + username + "        00:33:37 R batch");

        $('#view-output-lsdtm-script').text("ls " + outputDirectory);
        $('#example-view-output-lsdtm-script').text("-bash-4.2$ ls /home/" + username + "/test\nfred_spew2synthia.e557925  fred_spew2synthia.o557925  OUT  params");

        $('#view-error-lsdtm-script').text("cat " + outputDirectory + "/fred_spew2synthia.e######");
        $('#example-view-error-lsdtm-script').text("-bash-4.2$ cat /home/" + username + "/fred_spew2synthia.e557925\n\nThe following have been reloaded with a version change:\n1) gcc/4.8.3 => gcc/6.1.0");

        $('#view-stdout-lsdtm-script').text("tail " + outputDirectory + "/fred_spew2synthia.o######");
        $('#example-view-stdout-lsdtm-script').text("-bash-4.2$ tail /home/" + username + "/fred_spew2synthia.o557925\n\nday 239 report population took 0.000115 seconds\n" +
            "day 239 maxrss 4068524\nday 239 finished Fri Apr  7 14:53:10 2017\nDAY_TIMER day 239 took 0.002799 seconds\n\n\n" +
            "FRED simulation complete. Excluding initialization, 240 days took 0.493485 seconds\nFRED finished Fri Apr  7 14:53:10 2017\nFRED took 52.511174 seconds");

        $('#view-fred-out-lsdtm-script').text("cat " + outputDirectory + "/OUT/out1.txt");
        $('#example-view-fred-out-lsdtm-script').text("-bash-4.2$ cat /home/" + username + "/OUT/out1.txt\nDay 0 Date 2012-01-02 WkDay Tue C 10 College 0 Cs 0 E 10 GQ 0 I 0 Is 0 M 0" +
            "Military 0 N 2278377 Nursing_Home 0 P 10 Prison 0 R 0 S 2278367 Week 1 Year 2012 AR 0.00 ARs 0.00 RR 0.00\nDay 1 Date 2012-01-03 WkDay Wed C 0 College 0 Cs 1 E" +
            "9 GQ 0 I 1 Is 1 M 0 Military 0 N 2278377 Nursing_Home 0 P 10 Prison 0 R 0 S 2278367 Week 1 Year 2012 AR 0.00 ARs 0.00 RR 0.00\n.\n.\n.\nDay 238 Date 2012-08-27" +
            "WkDay Tue C 127 College 0 Cs 81 E 232 GQ 0 I 570 Is 376 M 0 Military 0 N 2278377 Nursing_Home 0 P 802 Prison 0 R 2904 S 2274671 Week 35 Year 2012 AR 0.23 ARs 0.14 RR 0.95\n" +
            "Day 239 Date 2012-08-28 WkDay Wed C 108 College 0 Cs 75 E 228 GQ 0 I 593 Is 389 M 0 Military 0 N 2278377 Nursing_Home 0 P 821 Prison 0 R 2966 S 2274590 Week 35 Year 2012 AR 0.23 ARs 0.15 RR 1.20");

        $('#lsdtm-script-container').show();
    } else {
        $('#lsdtm-script-container').hide();
    }
}

function sortSelect(selectId) {
    var options = $(selectId + " option");
    var selected = $(selectId).val();

    options.sort(function(a,b) {
        if (a.text > b.text) return 1;
        if (a.text < b.text) return -1;
        return 0
    });

    $(selectId).empty().append(options);
    $(selectId).val(selected);
}

function checkLocationSelect() {
    if($("#location-select").val() != '') {
        $("#synthpop-radios").children().each(function(index, child) {
            var text = $(child).text();

            if(text != "Synthia") {
                $(child).removeAttr("disabled");
            }

            if(text == "SPEW") {
                $(child).children().each(function(index, childsChild) {
                    $(childsChild).removeAttr("disabled");
                    $(childsChild).click();
                });
                drawDiagram();
            }
        });
    } else {
        $("#synthpop-radios").children().each(function(index, child) {
            var text = $(child).text();
            $(child).attr("disabled", "disabled");

            if(text == "SPEW") {
                $(child).children().each(function(index, childsChild) {
                    $(childsChild).attr("disabled", "disabled");
                    $(childsChild).removeAttr("checked");
                });
                drawDiagram();
            }
        });
    }
}

function copyToClipboard(elementId) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val($(elementId).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

function download(filename, elementId) {
    var text = $(elementId).text();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function toggleElementById(id, element) {
    event.preventDefault();
    var example = $(element).text().indexOf('example') > -1;
    var isVisible = $(id).is(":visible");

    if(isVisible) {
        $(id).fadeOut();

        if(!example) {
            $(element).toggleClass('glyphicon-minus glyphicon-plus');
            $('#example-' + id.replace('#','')).fadeOut();

            var spanId = "#span-a-" + id.replace('#','').replace('-code-block', '');
            var hrefId = "#a-" + id.replace('#','').replace('-code-block', '');

            $(spanId).hide();
            $(hrefId).text('show example');
        } else {
            $(element).text('show example');
        }
    } else {
        $(id).fadeIn();

        if(!example) {
            $(element).toggleClass('glyphicon-plus glyphicon-minus');
            $('#example-' + id.replace('#','')).fadeOut();

            var spanId = "#span-a-" + id.replace('#','').replace('-code-block', '');
            $(spanId).show();
        } else {
            $(element).text('hide example');
        }
    }
}