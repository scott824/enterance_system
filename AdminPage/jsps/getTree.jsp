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
		/*query += "select workplace.workplace, sosok.short_sosokcode, workplace.workplacecode, sosok.sosokcode ";
		query += "from enterance_workplace_code workplace, enterance_sosokcode sosok, enterance_tree tree ";
		query += "where workplace.workplacecode = tree.workplacecode and sosok.sosokcode = tree.sosokcode ";
		query += "order by workplace.workplacecode";*/
		query += "select workplace.workplace, nvl(tree.short_sosokcode, '미등록'), workplace.workplacecode, tree.sosokcode ";
		query += "from enterance_workplace_code workplace, (select sosok.short_sosokcode, tree.workplacecode, tree.sosokcode ";
		query += "from enterance_sosokcode sosok, enterance_tree tree ";
		query += "where sosok.sosokcode = tree.sosokcode ";
		query += "order by tree.workplacecode) tree ";
		query += "where workplace.workplacecode = tree.workplacecode(+)";

		ps = conn.prepareStatement(query);
		rs = ps.executeQuery();
		out.print("4,workplace,short_sosokcode,workplacecode,sosokcode");
		while(rs.next()) {
			//	workplace
			out.print("," + rs.getString(1) + ",");

			//	sosok name
			out.print(rs.getString(2) + ",");

			//	workplacecode
			out.print(rs.getString(3) + ",");

			//	sosokcode
			out.print(rs.getString(4));
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