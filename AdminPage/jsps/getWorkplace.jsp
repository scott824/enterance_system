<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%
	PreparedStatement ps = null;
	ResultSet rs = null;
	Connection conn = null;

	String workplace = request.getParameter("name");
	
	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);
		
		String query = "";
		query += "select workplace, workplacecode ";
		query += "from enterance_workplace_code ";
		if(workplace != null)
			query += "where workplace like '%" + workplace + "%' ";
		query += "order by workplacecode";

		ps = conn.prepareStatement(query);
		rs = ps.executeQuery();
		out.print("2,workplace,workplacecode");
		while(rs.next()) {
			//	workplace
			out.print("," + rs.getString(1) + ",");

			//	workplacecode
			out.print(rs.getString(2));
		}
		if(rs!=null) rs.close();
		if(ps!=null) ps.close();
	}
	catch(Exception e) {
		out.println("error\n" + e);
	}
	finally {
		if(rs!=null) rs.close();
		if(ps!=null) ps.close();
		if(conn!=null) conn.close();
	}
%>