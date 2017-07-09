<%@ page contentType="text/html; charset=euc-kr" %>
<jsp:include page="set.jsp">
	<jsp:param name="tableName" value="certchecker" />
	<jsp:param name="pageLocation" value="AdminPage-right" />

	<jsp:param name="columnNames" value="sosokcode,per_code" />
	<jsp:param name="logColumnNames" value="sosokname,person" />
	<jsp:param name="logColumnKoreanNames" value="소속,사용자" />
</jsp:include>