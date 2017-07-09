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
		
		if(workplace.compareTo("all") != 0) {
			query = new StringBuffer();
			query.append("select seq, series, place.plusworkplacecode, num, isbyung ");
			query.append("from ENTERANCE_ORDEREACHPLACESERIES place, ENTERANCE_ORDERSERIES series ");
			query.append("where place.plusworkplacecode = series.plusworkplacecode and place.workplacecode = '"+ workplace +"' ");
			query.append("order by seq");

			ps = conn.prepareStatement(query.toString());
			rs = ps.executeQuery();
			Vector placecode = new Vector();
			Vector num = new Vector();
			Vector isbyung = new Vector();
			Vector name = new Vector();
			while(rs.next()) {
				out.print("<option value='"+ rs.getString(3) +"'>");
				out.println(rs.getString(2) + "</option>");
				placecode.addElement(rs.getString(3));
				num.addElement(rs.getString(4));
				isbyung.addElement(rs.getString(5));
				name.addElement(rs.getString(2));
			}
			if(rs != null) rs.close();
			if(ps != null) ps.close();
			
			for(int i=0; i < placecode.size(); i++) {
				out.print("," + placecode.elementAt(i));
				out.print("," + num.elementAt(i));
				out.print("," + isbyung.elementAt(i));
				out.print("," + name.elementAt(i));
			}
		}
		else {
			ps = conn.prepareStatement("select series, plusworkplacecode from ENTERANCE_ORDERSERIES");
			rs = ps.executeQuery();
			while(rs.next()) {
				out.print(rs.getString(1) + ",");
				out.print(rs.getString(2) + ",");
			}
			if(rs != null) rs.close();
			if(ps != null) ps.close();
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