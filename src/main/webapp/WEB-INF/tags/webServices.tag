<%@ taglib tagdir="/WEB-INF/tags" prefix="myTags" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s" %>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form" %>

<script>
    hardcodeFromJson("${pageContext.request.contextPath}", "/resources/hardcoded-web-services.json", webservices, webservicesDictionary, webservicesSettings, '#webservices-treeview', 'expandedWebServices');
</script>