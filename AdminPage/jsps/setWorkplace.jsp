<%@ page contentType="text/html; charset=euc-kr" %>
<jsp:include page="set.jsp">
	<jsp:param name="tableName" value="workplace_code" />
	<jsp:param name="pageLocation" value="AdminPage-left-add" />

	<jsp:param name="columnNames" value="workplace,workplacecode" />
	<jsp:param name="logColumnNames" value="workplace,workplacecode" />
	<jsp:param name="logColumnKoreanNames" value="근무지이름,코드" />
</jsp:include>