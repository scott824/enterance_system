<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%
	String workplacecode = request.getParameter("workplacecode");
	String year = request.getParameter("year");
	String month = request.getParameter("month");

	String query = "";
	if(Integer.parseInt(month) < 10)
		month = "0" + month;

	PreparedStatement ps = null;
	ResultSet rs = null;
	Connection conn = null;

	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);

		Vector date = new Vector();
		Vector person = new Vector();

		String prev_year = "";
		String prev_month = "";
		String next_year = "";
		String next_month = "";

		if(month.compareTo("01") == 0) {
			prev_year = String.valueOf(Integer.parseInt(year)-1);
			prev_month = "12";
			next_year = year;
			next_month = "02";
		}
		else if(month.compareTo("12") == 0) {
			prev_year = year;
			prev_month = "11";
			next_year = String.valueOf(Integer.parseInt(year)+1);
			next_month = "01";
		}
		else {
			prev_year = year;
			prev_month = String.valueOf(Integer.parseInt(month)-1);
			if(Integer.parseInt(prev_month) < 10)
				prev_month = "0" + prev_month;
			next_year = year;
			next_month = String.valueOf(Integer.parseInt(month)+1);
			if(Integer.parseInt(next_month) < 10)
				next_month = "0" + next_month;
		}

		query = "";
		query += "select c.rankname, u.name, to_char(d.work_date, 'yyyy/mm/dd'), s.plusworkplacecode ";
		query += "from enterance_duty d, avs11u0t u, avs11c1t c, (select concat(workplacecode, plusworkplacecode) fullname, seq, plusworkplacecode from enterance_ordereachplaceseries where workplacecode = '"+workplacecode+"') s ";
		query += "where (to_char(d.work_date, 'yyyy/mm') like '"+year+"/"+month+"' or to_char(d.work_date, 'yyyy/mm') like '"+prev_year+"/"+prev_month+"' or to_char(d.work_date, 'yyyy/mm') like '"+next_year+"/"+next_month+"') and d.workplacecode like '"+workplacecode+"%' and d.gunbun=u.userid and u.rankcode=c.rankcode and s.fullname = d.workplacecode ";
		query += "order by to_char(d.work_date, 'yyyy/mm/dd'), s.seq, d.work_date";

		ps = conn.prepareStatement(query);
		rs = ps.executeQuery();
		out.print("%");
		while(rs.next()) {
			out.print(rs.getString(3) + "%" + rs.getString(4) + "%" + rs.getString(1) + " " + rs.getString(2) + "%");
		}
		if(rs != null) rs.close();
		if(ps != null) ps.close();
	}
	catch(Exception e) {
		out.println("error\n" + e + "\n" + query);
	}
	finally {
		if(rs!=null) rs.close();
		if(ps!=null) ps.close();
		if(conn!=null) conn.close();
	}

%>