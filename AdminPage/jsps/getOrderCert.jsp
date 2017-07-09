<jsp:useBean id="UserInfoBean" class="mil.af.alw10.application.user.UserInfoBean" scope="session" />
<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%
	// sso 세션에서 가져온 변수들
	String userid = UserInfoBean.getUserid();
	String name = UserInfoBean.getName();
	String rankname = UserInfoBean.getRankname();
	String rankcode = UserInfoBean.getRankcode();
	String sosokcode = UserInfoBean.getSosokcode();
	String ClientIP = request.getRemoteAddr();
%>

<%
	String need_cert_name = request.getParameter("need");

	PreparedStatement ps = null;
	ResultSet rs = null;
	Connection conn = null;
	
	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);
		
		String query = "";
		/*query += "select code.workplace, c1t.rankname, u0t.name, code.workplacecode, cert.per_code ";
		query += "from enterance_certorder cert, avs11u0t u0t, enterance_workplace_code code, avs11c1t c1t ";
		query += "where cert.workplacecode = code.workplacecode and cert.per_code = u0t.sosokcode and c1t.rankcode = u0t.rankcode ";
		query += "order by code.workplacecode, c1t.rankcode";*/
		query += "select code.workplace, nvl(cert.rankname, ' '), nvl(cert.name, '공석'), code.workplacecode, cert.per_code ";
		query += "from (select c1t.rankname, u0t.name, cert.workplacecode, cert.per_code ";
		query += "from enterance_certorder cert, avs11u0t u0t, avs11c1t c1t ";
		query += "where cert.per_code = u0t.sosokcode and c1t.rankcode = u0t.rankcode order by cert.workplacecode, c1t.rankcode) cert";
		query += ", enterance_workplace_code code ";
		query += "where cert.workplacecode(+) = code.workplacecode ";

		ps = conn.prepareStatement(query);
		rs = ps.executeQuery();
		out.print("4,workplacename,person,workplacecode,per_code");
		while(rs.next()) {
			//	workplace
			out.print("," + rs.getString(1) + ",");

			//	rank name
			out.print(rs.getString(2) + " " + rs.getString(3) + ",");

			//	workplacecode
			out.print(rs.getString(4) + ",");

			//	per_code
			out.print(rs.getString(5));
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