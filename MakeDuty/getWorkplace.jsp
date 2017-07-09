<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%@ include file="../userInfoAndLog.jspf" %>

<%
	StringBuffer query = new StringBuffer();
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;

	try
	{
		conn = JDBCHelper.getConnection(JDBCHelper.A1);

		query = new StringBuffer();
		if(certOrder == 1) {
			query.append("select workplace, workplacecode from enterance_workplace_code ");
		}
		else {
			query.append("select workplace.workplace, workplace.workplacecode ");
			query.append("from enterance_certorder cert, enterance_workplace_code workplace ");
			query.append("where cert.per_code = '"+sosokcode+"' and cert.workplacecode = workplace.workplacecode ");
		}

		ps = conn.prepareStatement(query.toString());
		rs = ps.executeQuery();

		while(rs.next()) {
			out.print(","+rs.getString(1)+",");
			out.print(rs.getString(2));
		}
		if(rs != null ) rs.close();
		if(ps != null) ps.close();
	}
	catch(Exception e)
	{
		out.println("error " + e);
	}
	finally
	{
		if(rs != null) rs.close();
		if(ps != null) ps.close();
		if(conn != null) conn.close();
	}
%>