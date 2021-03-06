<%@ taglib tagdir="/WEB-INF/tags" prefix="myTags" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="s" %>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form" %>


<div id="pageModal" class="modal fade">
    <div class="modal-dialog" id="software-modal">
        <div class="modal-content">
            <div class="modal-header software-header">
                <h2 class="sub-title-font pull-left color-white" id="software-name"></h2>
                    <%--<span class="hidden-xs">
                        <img src="${pageContext.request.contextPath}/resources/img/psc_logo.png" id="logo-img" class="pull-right">
                    </span>--%>
            </div>
            <div class="modal-body">
                <myTags:softwareModalItem id="title" title="Title" hasHref="false"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="general-info" title="Human-readable synopsis" hasHref="false"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="pathogen-coverage" title="Pathogen coverage"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="location-coverage" title="Location coverage"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="species-included" title="Species included"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="host-species-included" title="Host species included"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="population-species" title="Population species"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="control-measures" title="Control measures"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="developer" title=""></myTags:softwareModalItem>

                <myTags:softwareModalItem id="version" title="Software version"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="type" title="Type"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="forecast-frequency" title="Frequency of forecast"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="diseases" title="Diseases"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="outcomes" title="Outcomes"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="region" title="Locations"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="forecasts" title="Forecasts"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="nowcasts" title="Nowcasts"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="web-application" title="Web application" hasHref="true"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="site" title="Website" hasHref="true"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="executables" title="Executables" hasHref="false"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="data-input-formats" title="Formats for data input"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="data-output-formats" title="Formats for data outputs"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="visualization-type" title="Types of visualizations"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="platform" title="Platform, environment, and dependencies"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="grant" title="Associated grants"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="doi" title="DOI"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="source-code" title="Link to code repository" hasHref="true"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="source-code-release" title="Source code release" hasHref="false"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="documentation" title="Documentation" hasHref="false"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="rest-documentation" title="REST documentation" hasHref="true"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="end-point-prefix" title="REST endpoint prefix" hasHref="true"></myTags:softwareModalItem>
                
                <myTags:softwareModalItem id="rest-source-code" title="REST service source code repository" hasHref="true"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="soap-documentation" title="SOAP documentation" hasHref="true"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="soap-endpoint" title="SOAP endpoint" hasHref="true"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="soap-source-code" title="SOAP service source code repository" hasHref="true"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="example-queries" title="Example Queries" hasHref="false"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="project-source-code" title="Associated project source code repository" hasHref="true"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="user-guides-and-manuals" title="User guides and manuals" hasHref="true"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="license" title="License" hasHref="false"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="publications-about-release" title="Publications about release" hasHref="false"></myTags:softwareModalItem>

                <myTags:softwareModalItem id="publications-that-used-release" title="Publications that used release" hasHref="false"></myTags:softwareModalItem>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
