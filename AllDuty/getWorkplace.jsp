<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%
	StringBuffer query = new StringBuffer();
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;

	try
	{
		conn = JDBCHelper.getConnection(JDBCHelper.A1);

		query = new StringBuffer();
		query.append("select * from enterance_workplace_code");

		ps = conn.prepareStatement(query.toString());
		rs = ps.executeQuery();
		Vector workplacecode = new Vector();
		Vector workplacename = new Vector();
		while(rs.next()) {
			workplacecode.addElement(rs.getString(2));
			workplacename.addElement(rs.getString(1));
		}
		if(rs != null ) rs.close();
		if(ps != null) ps.close();

		for(int i=0; i < workplacecode.size(); i++) {
			out.print(","+workplacecode.elementAt(i)+",");
			out.print(workplacename.elementAt(i));
		}
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