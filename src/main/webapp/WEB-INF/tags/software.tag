<%@ taglib tagdir="/WEB-INF/tags" prefix="myTags"%>
<%@ attribute name="software" required="true"
              type="java.lang.Iterable"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s"%>

<script>
    <%--<c:forEach items="${software}" var="folder" varStatus="loop">
        software.push({
            "text": "<span class=\"root-break\" onmouseover='toggleTitle(this)'>" + "${folder.name}" + "</span>",
            "nodes": [],
            "name": "${folder.name}"
        });

        <c:forEach items="${folder.list}" var="item">
            <c:if test="${not empty item}">
                var url = '';
                softwareDictionary['${item.name}'] = {};

                var title = '${item.name}';

                <c:if test="${not empty item.version}">
                    softwareDictionary['${item.name}']['version'] = '${item.version}';
                    title = getSoftwareTitle('${item.name}', '${item.version}');
                </c:if>

                <c:if test="${not empty item.developer}">
                    softwareDictionary['${item.name}']['developer'] = '${item.developer}';
                </c:if>

                <c:if test="${not empty item.doi}">
                    softwareDictionary['${item.name}']['doi'] = '${item.doi}';
                </c:if>

                <c:if test="${not empty item.sourceCodeUrl}">
                    softwareDictionary['${item.name}']['source'] = '${item.sourceCodeUrl}';
                    url = '${item.sourceCodeUrl}';
                </c:if>

                <c:if test="${not empty item.url}">
                    softwareDictionary['${item.name}']['location'] = '${item.url}';
                    url = '${item.url}';
                </c:if>

                <c:if test="${folder.name == 'Disease transmission models'}">
                    console.log('"' + '${item.name}' + '":', JSON.stringify(softwareDictionary['${item.name}']));
                    software[${loop.index}].nodes.push({
                        "text": '<div class="node-with-margin" onmouseover="toggleTitle(this)" onclick="openModal(\'${item.name}\')">' + title + '</div>',
                        "name": "${item.name}"
                    });
                </c:if>

                <c:if test="${folder.name != 'Disease transmission models'}">
                    software[${loop.index}].nodes.push({
                        "text": '<div class="node-with-margin" onmouseover="toggleTitle(this)">' + title + '</div>',
                        "url": url,
                        "name": "${item.name}"
                    });
                </c:if>
            </c:if>
        </c:forEach>
    </c:forEach>--%>

    if(isSoftwareHardcoded) {
        hardcodeSoftwareFromJson("${pageContext.request.contextPath}", "/resources/hardcoded-software.json")
    }

    /*if(!isSoftwareHardcoded) {
        buildSoftwareTree("${pageContext.request.contextPath}");
    }*/

</script>

