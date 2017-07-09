<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page import="java.net.*" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>


<%
	String workplace = URLDecoder.decode(request.getParameter("workplace"), "utf-8");
	String serieslist = URLDecoder.decode(request.getParameter("serieslist"), "utf-8");

	out.println(workplace);
	String arr[] = serieslist.split(",");
	for(int i=0; i < arr.length; i++)
		out.println(arr[i]);
	
	int lengthFromRequest = 0;
	try {
		lengthFromRequest = Integer.parseInt(arr[arr.length-5]);
	} catch(Exception e) {
		out.println(e);
	}
	int lengthFromDB = 0;
	out.println(lengthFromRequest);

	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;

	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);
		ps = conn.prepareStatement("select count(*) from ENTERANCE_ORDEREACHPLACESERIES where workplacecode ='"+workplace+"' ");
		rs = ps.executeQuery();
		while(rs.next())
			lengthFromDB = rs.getInt(1);
		if(rs != null)	rs.close();
		if(ps != null)	ps.close();
		
		for(int i=0, j=0; i < lengthFromRequest; i++, j += 4) {
			if(i < lengthFromDB) {
				ps = conn.prepareStatement("update ENTERANCE_ORDEREACHPLACESERIES set num = ?, plusworkplacecode = ?, isbyung = ? where workplacecode = ? and seq = ? ");
				ps.setInt(1, Integer.parseInt(arr[j+2]));
				ps.setString(2, arr[j+1]);
				ps.setString(3, arr[j+3]);
				ps.setString(4, workplace);
				ps.setInt(5, Integer.parseInt(arr[j]));
				ps.executeUpdate();
				if(ps != null)	ps.close();
			}
			else {
				ps = conn.prepareStatement("insert into ENTERANCE_ORDEREACHPLACESERIES (workplacecode, num, plusworkplacecode, isbyung, seq) values (?, ?, ?, ?, ?) ");
				ps.setString(1, workplace);
				ps.setInt(2, Integer.parseInt(arr[j+2]));
				ps.setString(3, arr[j+1]);
				ps.setString(4, arr[j+3]);
				ps.setInt(5, Integer.parseInt(arr[j]));
				ps.executeUpdate();
				if(ps != null)	ps.close();
			}
		}
		if(lengthFromRequest < lengthFromDB) {
			for(int i=lengthFromRequest; i < lengthFromDB; i++) {
				ps = conn.prepareStatement("delete from ENTERANCE_ORDEREACHPLACESERIES where seq = ? and workplacecode = ? ");
				ps.setInt(1, i+1);
				ps.setString(2, workplace);
				ps.executeUpdate();
				if(ps != null)	ps.close();
			}
		}
	}
	catch(SQLException e) {
		out.println("error " + e);
	}
	finally {
		if(rs != null) rs.close();
		if(conn != null) conn.close();
		if(ps != null) ps.close();
	}
%>