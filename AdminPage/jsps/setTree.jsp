<%@ page contentType="text/html; charset=euc-kr" %>
<jsp:include page="set.jsp">
	<jsp:param name="tableName" value="tree" />
	<jsp:param name="pageLocation" value="AdminPage-mid" />

	<jsp:param name="columnNames" value="workplacecode,sosokcode" />
	<jsp:param name="logColumnNames" value="workplace,short_sosokcode" />
	<jsp:param name="logColumnKoreanNames" value="근무지,소속" />
</jsp:include>