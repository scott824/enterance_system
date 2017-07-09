<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%
	PreparedStatement ps = null;
	ResultSet rs = null;
	Connection conn = null;
	
	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);
		
		String query = "";
		query += "select nvl(workplace.workplacecode, 'X'), nvl(sosok.sosokcode, 'X'), workplace.per_code, sosok.per_code, workplace.person, sosok.person ";
		query += "from (select ord.workplacecode, ord.per_code,c1t.rankname||' '||u0t.name person ";
		query += "      from enterance_certorder ord, avs11u0t u0t, avs11c1t c1t ";
		query += "      where ord.workplacecode = 'ADMIN' and ord.per_code = u0t.sosokcode and u0t.rankcode = c1t.rankcode order by c1t.rankcode) workplace ";
		query += "      FULL JOIN ";
		query += "     (select checker.sosokcode, checker.per_code,c1t.rankname||' '||u0t.name person ";
		query += "      from enterance_certchecker checker, avs11u0t u0t, avs11c1t c1t ";
		query += "      where checker.sosokcode = 'ADMIN' and checker.per_code = u0t.sosokcode and u0t.rankcode = c1t.rankcode order by c1t.rankcode) sosok ";
		query += "on workplace.per_code = sosok.per_code";
		
		ps = conn.prepareStatement(query);
		rs = ps.executeQuery();
		out.print("4,workplacecode,sosokcode,per_code,person");
		while(rs.next()) {
			//	workplacecode
			out.print("," + rs.getString(1) + ",");

			//	sosokcode
			out.print(rs.getString(2) + ",");

			//	per_code
			if(rs.getString(3) == null) {
				out.print(rs.getString(4) + ",");
				out.print(rs.getString(6));
			}
			else {
				out.print(rs.getString(3) + ",");
				out.print(rs.getString(5));
			}
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