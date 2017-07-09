<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>


<%
	//String workplace = request.getParameter("workplace");

	StringBuffer query = new StringBuffer();
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;

	try
	{
		conn = JDBCHelper.getConnection(JDBCHelper.A1);

		query = new StringBuffer();
		query.append("select * from enterance_workplace_code ") ;

		ps = conn.prepareStatement(query.toString());
		rs = ps.executeQuery();
		out.println("<table>");
		while(rs.next()) {
			out.println("<tr>");
			out.println("<td class='"+rs.getString(2)+"'>" + rs.getString(1) + "</td>");
			out.println("</tr>");
		}
		out.println("</table>");
		if(rs != null ) rs.close();
		if(ps != null) ps.close();
	}
	catch(Exception e)
	{
		out.println("error\n" + e);
	}
	finally
	{
		if(rs != null) rs.close();
		if(ps != null) ps.close();
		if(conn != null) conn.close();
	}
%>