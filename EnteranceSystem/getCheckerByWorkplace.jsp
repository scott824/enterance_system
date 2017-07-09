<%@ page contentType = "text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper"%>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%@ include file="../userInfoAndLog.jspf" %>

<%
	String year = request.getParameter("year");
	String month = request.getParameter("month");
	String workplace = request.getParameter("workplace");

	if(Integer.parseInt(month) < 10)
		month = "0" + month;

	PreparedStatement ps = null;
	ResultSet rs = null;
	Connection conn = null;

	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);

		Vector cert = new Vector();

		ps = conn.prepareStatement("select sosokcode from enterance_certchecker where per_code='"+sosokcode+"'");
		rs = ps.executeQuery();
		while(rs.next()) {
			cert.addElement(rs.getString(1));
		}
		if(rs!=null) rs.close();
		if(ps!=null) ps.close();

		Vector plus_workplacecode = new Vector();
		Vector plus_code = new Vector();
		ps = conn.prepareStatement("select workplacecode, plusworkplacecode from ENTERANCE_ORDEREACHPLACESERIES where seq = '1'");
		rs = ps.executeQuery();
		while(rs.next()) {
			plus_workplacecode.addElement(rs.getString(1));
			plus_code.addElement(rs.getString(2));
		}
		if(rs!=null) rs.close();
		if(ps!=null) ps.close();

		Vector date = new Vector();
		Vector person = new Vector();

		String query = "";
		query += "select c.rankname, u.name, to_char(d.work_date, 'yyyy/mm/dd') ";
		query += "from enterance_duty d, avs11u0t u, avs11c1t c ";
		query += "where to_char(d.work_date, 'yyyy/mm') like '"+year+"/"+month+"' and d.workplacecode='"+workplace+ plus_code.elementAt(plus_workplacecode.indexOf(workplace)) + "' and d.gunbun=u.userid and u.rankcode=c.rankcode ";
		query += "order by d.work_date";

		ps = conn.prepareStatement(query);
		rs = ps.executeQuery();
		while(rs.next()) {
			date.addElement(rs.getString(3));
			person.addElement(rs.getString(1) + " " + rs.getString(2));
			//out.println(rs.getString(3) + "<br>" + rs.getString(1) + " " + rs.getString(2) + "<br>");
		}
		if(rs != null) rs.close();
		if(ps != null) ps.close();

		Vector short_sosok = new Vector();
		Vector sosokcodes = new Vector();
		ps = conn.prepareStatement("select short_sosokcode, b.sosokcode from enterance_tree a, enterance_sosokcode b where workplacecode = '"+workplace+"' and a.sosokcode = b.sosokcode order by b.sosokcode");
		rs = ps.executeQuery();
		while(rs.next()) {
			short_sosok.addElement(rs.getString(1));
			sosokcodes.addElement(rs.getString(2));
		}
		if(rs != null) rs.close();
		if(ps != null) ps.close();

		if(date.size() > 0) {
			for(int i=0; i < date.size(); i++) {
				String check_button = "<img src='../image/button_ok.gif' style='float: right;' value='확인' />";	//	check button
				java.util.Date nowdate = new java.util.Date();
				if((nowdate.getYear()+1900)*10000 + (nowdate.getMonth()+1)*100 + nowdate.getDate() > Integer.parseInt(year)*10000 + Integer.parseInt(month)*100 + Integer.parseInt(date.get(i).toString().substring(8, 10))) {
					if(certChecker != 1)
						check_button = "";
				}

				out.println("<tr>");
				out.println("<td class='workplace' rowspan='2'>" + date.elementAt(i).toString()+ "</td>");
				out.println("<td class='worker' rowspan='2'>" + person.elementAt(i).toString()+ "</td>");	

				query = "";
				query += "select short_sosokcode, s.sosokcode, equal ";
				query += "from enterance_checker c, enterance_sosokcode s ";
				query += "where c.workplacecode='"+workplace+"' and to_char(c.workdate, 'yyyy/mm/dd') like '"+date.elementAt(i).toString()+"' and c.sosokcode=s.sosokcode order by s.sosokcode";
				ps = conn.prepareStatement(query);
				rs = ps.executeQuery();
				Vector equal_in = new Vector();
				Vector sosok_in = new Vector();
				Vector sosokname_in = new Vector();
				while(rs.next()) {
					sosokname_in.addElement(rs.getString(1));
					sosok_in.addElement(rs.getString(2));
					equal_in.addElement(rs.getString(3));
				}
				if(rs != null) rs.close();
				if(ps != null) ps.close();
				
				for(int j=0; j < 3; j++) {
					if(j < short_sosok.size())
						out.println("<td class='sosok'>" + short_sosok.elementAt(j).toString() + "</td>");
					else
						out.println("<td class='sosok'></td>");
				}
				out.println("</tr><tr>");
				String cert_check_button = "";
				if(sosok_in.size() > 0) {
					for(int j=0; j < 3; j++) {
						if(j < sosok_in.size()) {
							if(cert.contains(sosok_in.elementAt(j)) || certChecker == 1)
								cert_check_button = check_button;
							else
								cert_check_button = "";
							out.println("<td class='"+sosok_in.elementAt(j)+" equal' ");
							if(equal_in.elementAt(j) == null)
								out.print("style='background-color: #ffc'>미확인" + cert_check_button);
							else if(equal_in.elementAt(j).toString().compareTo("1") == 0)
								out.print(">일치");
							else
								out.print("style='background-color: #fcc'>불일치" + cert_check_button);
							out.print("</td>");
						}
						else {
							out.print("<td class='equal'></td>");
						}
					}
				}
				else {
					for(int j=0; j < 3; j++) {
						if(j < short_sosok.size()) {
							if(cert.contains(sosokcodes.elementAt(j)) || certChecker == 1)
								cert_check_button = check_button;
							else
								cert_check_button = "";
							out.println("<td class='"+sosokcodes.elementAt(j)+" equal' style='background-color: #ffc'>미확인"+cert_check_button+"</td>");
						}
						else
							out.println("<td class='equal'></td>");
					}
				}
				out.print("</tr>");
			}
		}
		else {
			out.print("<img src='../image/undefined.jpg'>");
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
%>