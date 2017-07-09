<%@ page contentType = "text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper"%>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%@ include file="../userInfoAndLog.jspf" %>

<%
	//	selected date
	String year = request.getParameter("year");
	String month = request.getParameter("month");
	String date = request.getParameter("date");

	// set date form
	if(Integer.parseInt(month) < 10)
		month = "0"+month;
	if(Integer.parseInt(date) < 10)
		date = "0"+date;

	

	PreparedStatement ps = null;
	ResultSet rs = null;
	Connection conn = null;

	PreparedStatement psIn = null;
	ResultSet rsIn = null;

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

		Vector workplaceName = new Vector();
		Vector workplaceCode = new Vector();

		// get workplace workplacecode
		ps = conn.prepareStatement("select * from ENTERANCE_WORKPLACE_CODE");
		rs = ps.executeQuery();
		while(rs.next()) {
			workplaceName.addElement(rs.getString(1));
			workplaceCode.addElement(rs.getString(2));
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

		//	table display
		for(int i=0; i < workplaceCode.size(); i++) {
			String query = "";
			query += "select a.name, b.rankname ";
			query += "from avs11u0t a, avs11c1t b ";
			query += "where a.userid=";
			query += "(select gunbun from enterance_duty where workplacecode='"+workplaceCode.elementAt(i)+plus_code.elementAt(plus_workplacecode.indexOf(workplaceCode.elementAt(i))) + "' and to_char(work_date, 'yyyy/mm/dd') like '"+year +"/"+ month +"/"+ date+"') ";
			query += "and a.rankcode = b.rankcode";
			ps = conn.prepareStatement(query);
			rs = ps.executeQuery();

			boolean next = false;

			if(next = rs.next() || true) {
				out.println("<tr>");
				//	workplace
				out.println("<td class='"+workplaceCode.elementAt(i)+" workplace' rowspan='2'>" + workplaceName.elementAt(i));
				out.println("</td>");

				String check_button = "<img src='../image/button_ok.gif' style='float: right;' value='확인' />";	//	check button

				//	check date 
				java.util.Date nowdate = new java.util.Date();
				if((nowdate.getYear()+1900)*10000 + (nowdate.getMonth()+1)*100 + nowdate.getDate() > Integer.parseInt(year + month + date)) {
					if(certChecker != 1)
						check_button = "";
				}
				boolean existWorker = true;
				try {
					//	worker
					out.println("<td class='worker' rowspan='2'>" + rs.getString(2) + " " + rs.getString(1));
				}
				catch(Exception e) {
					out.println("<td class='worker' rowspan='2' style='background-color: #ccd'>" + "미입력");
					check_button = "";
					existWorker = false;
				}
				out.println("</td>");

				query = "";
				query += "select s.short_sosokcode, c.equal, s.sosokcode ";
				query += "from (select sosokcode from enterance_tree where workplacecode='"+workplaceCode.elementAt(i)+"') a, enterance_sosokcode s, enterance_checker c ";
				query += "where a.sosokcode = s.sosokcode and c.sosokcode = a.sosokcode and c.workplacecode = '"+workplaceCode.elementAt(i)+"' and to_char(c.workdate, 'yyyy/mm/dd') like '"+year +"/"+ month +"/"+ date+"'";
				psIn = conn.prepareStatement(query);
				rsIn = psIn.executeQuery();
				Vector sosok = new Vector();
				Vector sosokCode = new Vector();
				Vector equ = new Vector();
				while(rsIn.next()) {
					sosok.addElement(rsIn.getString(1));
					equ.addElement(rsIn.getString(2));
					sosokCode.addElement(rsIn.getString(3));
				}
				if(rsIn!=null) rsIn.close();
				if(psIn!=null) psIn.close();
				if(sosok.size() == 0) {
					psIn = conn.prepareStatement("select s.short_sosokcode, s.sosokcode from (select sosokcode from enterance_tree where workplacecode='"+workplaceCode.elementAt(i)+"') a, enterance_sosokcode s where a.sosokcode = s.sosokcode");
					rsIn = psIn.executeQuery();
					while(rsIn.next()) {
						sosok.addElement(rsIn.getString(1));
						sosokCode.addElement(rsIn.getString(2));
					}
				}
				if(rsIn!=null) rsIn.close();
				if(psIn!=null) psIn.close();
				for(int j=0; j < 3; j++) {
					if(j < sosok.size())
						//	sosok
						out.println("<td class='"+sosokCode.elementAt(j)+" sosok'>" + sosok.elementAt(j) + "</td>");
					else
						out.println("<td class='sosok'></td>");
				}
				out.println("</tr><tr>");
				String cert_check_button = "";
				for(int j=0; j < 3; j++) {
					if(j < sosok.size()) {
						if(cert.contains(sosokCode.elementAt(j)) || certChecker == 1)
							cert_check_button = check_button;
						else
							cert_check_button = "";
					}
					if(j < equ.size()) {
						//	equal
						if(equ.elementAt(j) == null)
							out.println("<td class ='"+sosokCode.elementAt(j)+" equal' style='background-color: #ffc'>미확인 "+cert_check_button+"</td>");
						else if(equ.elementAt(j).toString().compareTo("1") == 0)
							out.println("<td class ='"+sosokCode.elementAt(j)+" equal'>일치</td>");
						else
							out.println("<td class ='"+sosokCode.elementAt(j)+" equal' style='background-color: #fcc'>불일치 "+cert_check_button+"</td>");
					}
					else if(j < sosok.size()) {
						if(check_button.compareTo("") ==0) {
							if(existWorker)
								out.println("<td class ='"+sosokCode.elementAt(j)+" equal' style='background-color: #ffc'>미확인</td>");
							else
								out.println("<td class ='"+sosokCode.elementAt(j)+" equal'></td>");
						}
						else
							out.println("<td class ='"+sosokCode.elementAt(j)+" equal' style='background-color: #ffc'>미확인"+cert_check_button+"</td>");
					}
					else
						out.println("<td class ='equal'></td>");
				}
				out.println("</tr>");
			}
			if(rs!=null) rs.close();
			if(ps!=null) ps.close();
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