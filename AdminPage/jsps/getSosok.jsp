<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%
	PreparedStatement ps = null;
	ResultSet rs = null;
	Connection conn = null;

	String sosok = request.getParameter("name");
	
	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);
		
		String query = "";
		query += "select short_sosokcode, sosokcode ";
		query += "from enterance_sosokcode ";
		if(sosok != null)
			query += "where short_sosokcode like '%" + sosok + "%' ";
		query += "order by sosokcode";

		ps = conn.prepareStatement(query);
		rs = ps.executeQuery();
		out.print("2,short_sosokcode,sosokcode");
		while(rs.next()) {
			//	sosok
			out.print("," + rs.getString(1) + ",");

			//	sosokcode
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