<%@ page contentType="text/html; charset=euc-kr" %>
<jsp:include page="set.jsp">
	<jsp:param name="tableName" value="orderseries" />
	<jsp:param name="pageLocation" value="AdminPage-head-series" />

	<jsp:param name="columnNames" value="series,plusworkplacecode" />
	<jsp:param name="logColumnNames" value="series,plusworkplacecode" />
	<jsp:param name="logColumnKoreanNames" value="근무,코드" />
</jsp:include>