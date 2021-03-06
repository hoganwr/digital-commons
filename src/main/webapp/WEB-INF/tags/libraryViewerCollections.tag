<%@ taglib tagdir="/WEB-INF/tags" prefix="myTags"%>
<%@ attribute name="libraryViewerUrl" required="true"
              type="java.lang.String"%>
<%@ attribute name="libraryViewerToken" required="true"
              type="java.lang.String"%>
<%@ attribute name="spewRegions" required="true"
              type="java.util.List"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s"%>

<script>
    var stateHash =  {
        '01': 'Alabama',
        '02': 'Alaska',
        '03': 'American Samoa',
        '04': 'Arizona',
        '05': 'Arkansas',
        '06': 'California',
        '08': 'Colorado',
        '09': 'Connecticut',
        '10': 'Delaware',
        '11': 'District Of Columbia',
        '12': 'Florida',
        '13': 'Georgia',
        '15': 'Hawaii',
        '16': 'Idaho',
        '17': 'Illinois',
        '18': 'Indiana',
        '19': 'Iowa',
        '20': 'Kansas',
        '21': 'Kentucky',
        '22': 'Louisiana',
        '23': 'Maine',
        '24': 'Maryland',
        '25': 'Massachusetts',
        '26': 'Michigan',
        '27': 'Minnesota',
        '28': 'Mississippi',
        '29': 'Missouri',
        '30': 'Montana',
        '31': 'Nebraska',
        '32': 'Nevada',
        '33': 'New Hampshire',
        '34': 'New Jersey',
        '35': 'New Mexico',
        '36': 'New York',
        '37': 'North Carolina',
        '38': 'North Dakota',
        '39': 'Ohio',
        '40': 'Oklahoma',
        '41': 'Oregon',
        '42': 'Pennsylvania',
        '44': 'Rhode Island',
        '45': 'South Carolina',
        '46': 'South Dakota',
        '47': 'Tennessee',
        '48': 'Texas',
        '49': 'Utah',
        '50': 'Vermont',
        '51': 'Virginia',
        '53': 'Washington',
        '54': 'West Virginia',
        '55': 'Wisconsin',
        '56': 'Wyoming'
    };

    var syntheticEcosystemsByRegion = {
        text: "<span onmouseover='toggleTitle(this)'>SPEW synthetic ecosystems</span>",
        nodes: []
    };

    <c:forEach items="${spewRegions}" var="region" varStatus="loop">
        <c:if test="${not empty region.children}">
            syntheticEcosystemsByRegion.nodes.push({'name': "${region.name}", 'text':formatLocation("${region.name}"), 'nodes': []});
            var currentNode = syntheticEcosystemsByRegion.nodes[syntheticEcosystemsByRegion.nodes.length - 1].nodes;
            <c:forEach items="${region.children}" var="child">
                <myTags:recurseRegions region="${child.value}"></myTags:recurseRegions>
            </c:forEach>
        </c:if>
        <c:if test="${empty region.children}">
            syntheticEcosystemsByRegion.nodes.push({'name': "${region.name}", 'text':formatLocation("${region.name}")});
        </c:if>
    </c:forEach>

    syntheticEcosystemsByRegion.nodes.sort(compareNodes);
    sortSelect("#location-select");

    for(var i in syntheticEcosystemsByRegion.nodes) {
        if(syntheticEcosystemsByRegion.nodes[i].nodes != null) {
            syntheticEcosystemsByRegion.nodes[i].nodes.sort(compareNodes);
        }
    }

    $(document).ready(function () {
        var libraryData;
        $.ajax({
            type : "GET",
            contentType : "application/json; charset=utf-8",
            url : "${pageContext.request.contextPath}/getCollectionsJson",
            dataType : 'json',
            data: {},
            cache: false,
            timeout : 100000,
            success : function(data) {
                libraryData = data;
            },
            error : function(xhr, textStatus, errorThrown) {
                console.log(xhr.responseText);
                console.log(textStatus);
                console.log(errorThrown);
                libraryData = null;
            },
            complete : function(e) {
                $('#data-and-knowledge-treeview').treeview({
                    data: getDataAndKnowledgeTree(libraryData, syntheticEcosystemsByRegion, ${libraryViewerUrl}, "${pageContext.request.contextPath}"),
                    showBorder: false,

                    expandIcon: "glyphicon glyphicon-chevron-right",
                    collapseIcon: "glyphicon glyphicon-chevron-down",
                });
                $('#data-and-knowledge-treeview').treeview('collapseAll', { silent: true });
                $('#data-and-knowledge-treeview').on('nodeSelected', function(event, data) {
                    if(typeof data['nodes'] != undefined) {
                        $('#data-and-knowledge-treeview').treeview('toggleNodeExpanded', [data.nodeId, { levels: 1, silent: true } ]).treeview('unselectNode', [data.nodeId, {silent: true}]);
                    }

                    var expandedDataAndKnowledge = $.parseJSON(sessionStorage.getItem("expandedDataAndKnowledge"));

                    if(data.state.expanded) {
                        if(expandedDataAndKnowledge != null) {
                            var index = expandedDataAndKnowledge.indexOf(data.nodeId);
                            if (index > -1) {
                                expandedDataAndKnowledge.splice(index, 1);
                            }
                        }
                    } else {
                        if(expandedDataAndKnowledge != null) {
                            var index = expandedDataAndKnowledge.indexOf(data.nodeId);
                            if (index <= -1) {
                                expandedDataAndKnowledge.push(data.nodeId);
                            }
                        } else {
                            expandedDataAndKnowledge = [];
                            expandedDataAndKnowledge.push(data.nodeId);
                        }
                    }

                    sessionStorage.setItem("expandedDataAndKnowledge", JSON.stringify(expandedDataAndKnowledge));

                    if(data.url != null && data.state.selected == true) {
                        ga('send', {
                            hitType: 'event',
                            eventCategory: 'Clickthrough',
                            eventAction: data.url
                        });

                        var url  = data.url;
                        if(url.search("apolloLibraryViewer") > -1) {
//                        if($.contains(data.url, "apolloLibraryViewer")) {
                            $(location).attr('href', "${pageContext.request.contextPath}" + "/midas-sso/view?url=" + encodeURIComponent(data.url));
                        } else {
                            $(location).attr('href', data.url);
                        }
                    }
                });
                var expandedDataAndKnowledge = $.parseJSON(sessionStorage.getItem("expandedDataAndKnowledge"));
                var toRemove = [];

                if(expandedDataAndKnowledge == null) {
                    var openByDefault = ["SPEW synthetic ecosystems", "Disease surveillance data", "US notifiable diseases", "Mortality data", "Case series", "Rabies case listings", "Epidemics", "Infectious disease scenarios", "H1N1 infectious disease scenarios", "Standards for encoding data", "Synthia"];
                    var openByDefaultIds = [];
                    for(var i = 0; i < openByDefault.length; i++) {
                        var matchingNode = $('#data-and-knowledge-treeview').treeview('search', [ openByDefault[i], {
                            ignoreCase: false,     // case insensitive
                            exactMatch: false,    // like or equals
                            revealResults: false  // reveal matching nodes
                        }])[0];
                        $('#data-and-knowledge-treeview').treeview('clearSearch');

                        if(matchingNode != null) {
                            openByDefaultIds.push(matchingNode.nodeId);
                        }
                    }

                    expandedDataAndKnowledge = openByDefaultIds;
                    sessionStorage.setItem("expandedDataAndKnowledge", JSON.stringify(openByDefaultIds));
                }

                if(expandedDataAndKnowledge != null) {
                    for (var i = 0; i < expandedDataAndKnowledge.length; i++) {
                        try {
                            $('#data-and-knowledge-treeview').treeview('expandNode', [expandedDataAndKnowledge[i], {silent: true}]);
                        } catch(err) {
                            toRemove.push(i);
                        }
                    }

                    if(toRemove.length > 0) {
                        for(var i = 0; i < toRemove.length; i++) {
                            expandedDataAndKnowledge.splice(toRemove[i], 1);
                        }

                        sessionStorage.setItem("expandedDataAndKnowledge", JSON.stringify(expandedDataAndKnowledge));
                    }
                }
            }
        });
        

    });

</script>

