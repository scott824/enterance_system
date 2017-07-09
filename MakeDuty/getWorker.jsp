<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>


<%
	String workplace = request.getParameter("workplace");

	StringBuffer query = new StringBuffer();
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;

	try
	{
		conn = JDBCHelper.getConnection(JDBCHelper.A1);

		query = new StringBuffer();
		query.append("select * from enterance_worker where WORKPLACECODE = '"+workplace+"' order by seqnumber") ;

		ps = conn.prepareStatement(query.toString());
		rs = ps.executeQuery();
		while(rs.next()) {
			out.println("<tr>");
			out.println("<td class='num numTD'>" + rs.getInt(2) + "</td>");
			out.println("<td class='member'>"+ rs.getString(3) +"</td>");
			out.println("<td class='rank'>" + rs.getString(5) + "</td>");
			out.println("<td class='name'>" + rs.getString(6) + "</td>");
			out.println("<td class='other'>" + rs.getString(7) + "</td>");
			out.println("<td class='gunbun'>" + rs.getString(4) + "</td>");
			out.println("</tr>");
		}
		if(rs != null ) rs.close();
		if(ps != null) ps.close() ;
	}
	catch(SQLException e)
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