<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%@ include file="userInfoAndLog.jspf" %>

<%
	String need_cert_name = request.getParameter("need");
	String adminPage = "";

	PreparedStatement ps = null;
	ResultSet rs = null;
	Connection conn = null;
	
	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);
		
		if(need_cert_name.compareTo("true") == 0) {
			if(certChecker == 1)
				out.print("包府磊 ");
			else {
				ps = conn.prepareStatement("select short_sosokcode from enterance_certchecker a, enterance_sosokcode b where a.per_code='"+sosokcode+"' and a.sosokcode = b.sosokcode");
				rs = ps.executeQuery();
				while(rs.next()) {
					out.print(rs.getString(1)+" ");
				}
				if(rs!=null) rs.close();
				if(ps!=null) ps.close();
			}
		}
	}
	catch(Exception e) {
		out.println("error\n" + e);
	}
	finally {
		if(rs!=null) rs.close();
		if(ps!=null) ps.close();
		if(conn!=null) conn.close();
	}
	if(certOrder + certChecker == 2) {
		adminPage = "<a href='http://www.wg10.af.mil:8003/alw10/service/enterance/AdminPage/AdminPage.html'> 包府磊 其捞瘤 捞悼</a>";
	}
	out.print("\n" + adminPage + "  " + rankname + " " + name);
	
	/* 立加 肺弊 */
	if(session.getAttribute("login") == null) {
		log.insertLog("Login", "眉拌 立加");
		session.setAttribute("login", "success");
	}
%>