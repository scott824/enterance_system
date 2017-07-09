<%@ page contentType="text/html; charset=euc-kr" %>
<jsp:include page="set.jsp">
	<jsp:param name="tableName" value="sosokcode" />
	<jsp:param name="pageLocation" value="AdminPage-right-add" />

	<jsp:param name="columnNames" value="short_sosokcode,sosokcode" />
	<jsp:param name="logColumnNames" value="short_sosokcode,sosokcode" />
	<jsp:param name="logColumnKoreanNames" value="소속,코드" />
</jsp:include>