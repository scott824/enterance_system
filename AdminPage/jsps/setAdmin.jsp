<%@ page contentType="text/html; charset=euc-kr" %>
<jsp:include page="set.jsp">
	<jsp:param name="tableName" value="certorder" />
	<jsp:param name="pageLocation" value="AdminPage-head-admin" />

	<jsp:param name="columnNames" value="workplacecode,per_code" />
	<jsp:param name="logColumnNames" value="workplacecode,person" />
	<jsp:param name="logColumnKoreanNames" value="명령,관리자" />
</jsp:include>

<jsp:include page="set.jsp">
	<jsp:param name="tableName" value="certchecker" />
	<jsp:param name="pageLocation" value="AdminPage-head-admin" />

	<jsp:param name="columnNames" value="sosokcode,per_code" />
	<jsp:param name="logColumnNames" value="sosokcode,person" />
	<jsp:param name="logColumnKoreanNames" value="출입통제,관리자" />
</jsp:include>