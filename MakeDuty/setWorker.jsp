<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page import="java.net.*" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>


<%
	String workplace = URLDecoder.decode(request.getParameter("workplace"), "utf-8");
	String workerlist = URLDecoder.decode(request.getParameter("workerlist"), "utf-8");

	out.println(workplace);
	String arr[] = workerlist.split(",");
	for(int i=0; i < arr.length; i++)
		out.println(arr[i]);
	
	int lengthFromRequest = 0;
	try {
		lengthFromRequest = Integer.parseInt(arr[arr.length-7]);
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
		ps = conn.prepareStatement("select count(*) from enterance_worker where workplacecode ='"+workplace+"' ");
		rs = ps.executeQuery();
		while(rs.next())
			lengthFromDB = rs.getInt(1);
		if(rs != null)	rs.close();
		if(ps != null)	ps.close();
		
		for(int i=0, j=0; i < lengthFromRequest; i++, j += 6) {
			if(i < lengthFromDB) {
				ps = conn.prepareStatement("update enterance_worker set sosok = ?, ent_rank = ?, name = ?, bigo = ?, gunbun = ? where workplacecode = ? and seqnumber = ? ");
				ps.setString(1, arr[j+1]);
				ps.setString(2, arr[j+2]);
				ps.setString(3, arr[j+3]);
				ps.setString(4, arr[j+4]);
				ps.setString(5, arr[j+5]);
				ps.setString(6, workplace);
				ps.setInt(7, Integer.parseInt(arr[j]));
				ps.executeUpdate();
				if(ps != null)	ps.close();
			}
			else {
				ps = conn.prepareStatement("insert into enterance_worker (workplacecode, seqnumber, sosok, gunbun, ent_rank, name, bigo) values (?, ?, ?, ?, ?, ?, ?) ");
				ps.setString(1, workplace);
				ps.setInt(2, i+1);
				ps.setString(3, arr[j+1]);
				ps.setString(4, arr[j+5]);
				ps.setString(5, arr[j+2]);
				ps.setString(6, arr[j+3]);
				ps.setString(7, arr[j+4]);
				ps.executeUpdate();
				if(ps != null)	ps.close();
			}
		}
		if(lengthFromRequest < lengthFromDB) {
			for(int i=lengthFromRequest; i < lengthFromDB; i++) {
				ps = conn.prepareStatement("delete from enterance_worker where seqnumber = ? and workplacecode = ? ");
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