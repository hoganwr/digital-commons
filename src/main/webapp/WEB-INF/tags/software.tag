<%@ taglib tagdir="/WEB-INF/tags" prefix="myTags"%>
<%@ attribute name="software" required="true"
              type="java.lang.Iterable"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s"%>

<script>
    <c:forEach items="${software}" var="folder" varStatus="loop">
        software.push({
            "text": "${folder.name}",
            "nodes": []
        });

        <c:forEach items="${folder.list}" var="item">
            <c:if test="${not empty item}">
                software[${loop.index}].nodes.push({
                    "text": "<div class=\"node-with-margin\">" + "${item.name}" + "</div>",
                    "url": "${pageContext.request.contextPath}/main/software/" + "${item.id}"
                });
            </c:if>
        </c:forEach>
    </c:forEach>

    var $softwareTree = $('#algorithm-treeview').treeview({
        data: software,
        showBorder: false,
        collapseAll: true,
        backColor: "#092940",
        onhoverColor: "#397AAC",
        color: "white",
        expandIcon: "glyphicon glyphicon-chevron-right",
        collapseIcon: "glyphicon glyphicon-chevron-down",

        onNodeSelected: function(event, data) {
            if(typeof data['nodes'] != undefined) {
                $('#algorithm-treeview').treeview('toggleNodeExpanded', [data.nodeId, { levels: 1, silent: true } ]).treeview('unselectNode', [data.nodeId, {silent: true}]);
            }

            if(data.url != null && data.state.selected == true) {
                window.location.href = data.url;
            }
        }
    });

    $('#algorithm-treeview').treeview('collapseAll', { silent: true });

</script>

