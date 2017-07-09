<%@ page contentType="text/html; charset=euc-kr" %>
<jsp:include page="set.jsp">
	<jsp:param name="tableName" value="certorder" />
	<jsp:param name="pageLocation" value="AdminPage-left" />

	<jsp:param name="columnNames" value="workplacecode,per_code" />
	<jsp:param name="logColumnNames" value="workplacename,person" />
	<jsp:param name="logColumnKoreanNames" value="근무지,사용자" />
</jsp:include>