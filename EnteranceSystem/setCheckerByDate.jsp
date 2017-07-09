<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page import="java.net.*" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%@ include file="../userInfoAndLog.jspf" %>

<%
	String workplacecode = request.getParameter("workplace");
	String sosok = request.getParameter("sosok");
	String year = request.getParameter("year");
	String month = request.getParameter("month");
	String date = request.getParameter("date");
	
	if(month.length() < 2)
		month = "0" + month;
	if(date.length() < 2)
		date = "0" + date;
	out.println(workplacecode);
	out.println(sosok);
	out.println(year);
	out.println(month);
	out.println(date);

	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;
	String query = "";

	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);
		
		int checkValue = 0;
		String dateformat = year +"/"+ month +"/"+ date;
		
		query = "select count(*) from enterance_checker where workplacecode='"+workplacecode+"' and to_char(workdate, 'yyyy/mm/dd') like '"+dateformat+"' and sosokcode='"+sosok+"'";
		ps = conn.prepareStatement(query);
		rs = ps.executeQuery();
		while(rs.next()) {
			checkValue = rs.getInt(1);
		}
		if(rs != null) rs.close();
		if(ps != null) ps.close();
		
		out.println(checkValue);
		if(checkValue > 0) {
			query = "update enterance_checker set equal=1 where workplacecode=? and to_char(workdate, 'yyyy/mm/dd')=? and sosokcode=?";
			ps = conn.prepareStatement(query);
			ps.setString(1, workplacecode);
			ps.setString(2, dateformat);
			ps.setString(3, sosok);

			ps.executeUpdate();
			if(ps != null) ps.close();
			log.insertLog("EnteranceSystem", "", "확인! 근무지 : " + workplacecode + ", 소속 : " + sosok + ", 날짜 : " + dateformat);
		}
		else {
			query = "select sosokcode from enterance_tree where workplacecode='"+workplacecode+"' ";
			ps = conn.prepareStatement(query);
			rs = ps.executeQuery();
			Vector sosokcodes = new Vector();
			while(rs.next()) {
				sosokcodes.addElement(rs.getString(1));
				out.print(rs.getString(1));
			}
			if(rs != null) rs.close();
			if(ps != null) ps.close();

			for(int i=0; i < sosokcodes.size(); i++) {
				out.println(sosokcodes.elementAt(i).toString());
				if(sosokcodes.elementAt(i).toString().compareTo(sosok) == 0) {
					query = "insert into enterance_checker (workplacecode, workdate, sosokcode, equal) values (?, to_date(?, 'yyyy/mm/dd'), ?, ?)";
					ps = conn.prepareStatement(query);
					ps.setString(1, workplacecode);
					ps.setString(2, dateformat);
					ps.setString(3, sosok);
					ps.setInt(4, 1);
					log.insertLog("EnteranceSystem", "", "확인! 근무지 : " + workplacecode + ", 소속 : " + sosok + ", 날짜 : " + dateformat);
				}
				else {
					query = "insert into enterance_checker (workplacecode, workdate, sosokcode) values (?, to_date(?, 'yyyy/mm/dd'), ?)";
					ps = conn.prepareStatement(query);
					ps.setString(1, workplacecode);
					ps.setString(2, dateformat);
					ps.setString(3, sosokcodes.elementAt(i).toString());
				}
				ps.executeUpdate();
				if(ps != null) ps.close();
			}
			
		}
	}
	catch(Exception e) {
		out.println("error\n" + e);
	}
	finally {
		if(rs != null) rs.close();
		if(ps != null) ps.close();
		if(conn != null) conn.close();
	}
%>