<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>

<%
	String workplace = request.getParameter("workplace");
	String year = request.getParameter("year");
	String month = request.getParameter("month");

	StringBuffer query = new StringBuffer();
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;
	PreparedStatement psForName = null;
	ResultSet rsForName = null;

	try
	{
		conn = JDBCHelper.getConnection(JDBCHelper.A1);

		int num = 0;
		ps = conn.prepareStatement("select num from ENTERANCE_ORDEREACHPLACESERIES where workplacecode='"+workplace.substring(0, 4)+"' and plusworkplacecode = '"+workplace.substring(4, workplace.length())+"'");
		rs = ps.executeQuery();
		while(rs.next()) {
			num = rs.getInt(1);
		}
		if(rs!=null) rs.close();
		if(ps!=null) ps.close();

		query = new StringBuffer();
		query.append("select workplacecode, to_char(work_date,'yyyy/mm/dd'), work_day, seqnumber, gunbun from enterance_duty where WORKPLACECODE = '"+workplace+"' and to_char(work_date,'yyyy') like '"+year+"' and to_char(work_date,'mm') like '"+month+"' order by work_date");

		ps=conn.prepareStatement(query.toString());
		rs=ps.executeQuery();
		if(num == 2) {
			boolean isForenoon = true;
			while(rs.next()) {
				if(isForenoon) {
					if(rs.getString(3).compareTo("일") == 0 || rs.getString(3).compareTo("토") == 0)
						out.println("<tr style='background-color: #fff2f2; border-bottom: 2px solid #fff2f2;'>");
					else if(rs.getString(3).compareTo("금") == 0)
						out.println("<tr style='background-color: #fffff2; border-bottom: 2px solid #fffff2;'>");
					else
						out.println("<tr style='border-bottom: 2px solid white;'>");
					out.print("<td class='date'>" + rs.getString(2));
					out.println("</td>");
					out.print("<td class='day'>" + rs.getString(3));
					out.println("</td>");
					out.print("<td class='num'>");
					if(rs.getString(4) != null)
						out.print(rs.getString(4));
					out.println("</td>");
					out.print("<td class='gunbun'>");
					if(rs.getString(5) != null)
						out.print(rs.getString(5));
					out.println("</td>");
					out.print("<td class='name'>");
					psForName = conn.prepareStatement("select name from avs11u0t where userid='"+rs.getString(5)+"'");
					rsForName = psForName.executeQuery();
					if(rsForName.next())
						out.print(rsForName.getString(1));
					if(psForName != null) psForName.close();
					if(rsForName != null) rsForName.close();
					out.println("</td>");
					out.println("</tr>");
					isForenoon = false;
				}
				else {
					if(rs.getString(3).compareTo("일") == 0 || rs.getString(3).compareTo("토") == 0)
						out.println("<tr style='background-color: #fff2f2; border-top: 2px solid #fff2f2;'>");
					else if(rs.getString(3).compareTo("금") == 0)
						out.println("<tr style='background-color: #fffff2; border-top: 2px solid #fffff2;'>");
					else
						out.println("<tr style='border-top: 2px solid white;'>");
					out.print("<td class='date' style='visibility: hidden'>" + rs.getString(2));
					out.println("</td>");
					out.print("<td class='day' style='visibility: hidden'>" + rs.getString(3));
					out.println("</td>");
					out.print("<td class='num'>");
					if(rs.getString(4) != null)
						out.print(rs.getString(4));
					out.println("</td>");
					out.print("<td class='gunbun'>");
					if(rs.getString(5) != null)
						out.print(rs.getString(5));
					out.println("</td>");
					out.print("<td class='name'>");
					psForName = conn.prepareStatement("select name from avs11u0t where userid='"+rs.getString(5)+"'");
					rsForName = psForName.executeQuery();
					if(rsForName.next())
						out.print(rsForName.getString(1));
					if(psForName != null) psForName.close();
					if(rsForName != null) rsForName.close();
					out.println("</td>");
					out.println("</tr>");
					isForenoon = true;
				}
			}
		}
		else {
			while(rs.next()) {
				if(rs.getString(3).compareTo("일") == 0 || rs.getString(3).compareTo("토") == 0)
					out.println("<tr style='background-color: #fff2f2;'>");
				else if(rs.getString(3).compareTo("금") == 0)
					out.println("<tr style='background-color: #fffff2;'>");
				else
					out.println("<tr>");
				out.print("<td class='date'>" + rs.getString(2));
				out.println("</td>");
				out.print("<td class='day'>" + rs.getString(3));
				out.println("</td>");
				out.print("<td class='num'>");
				if(rs.getString(4) != null)
					out.print(rs.getString(4));
				out.println("</td>");
				out.print("<td class='gunbun'>");
				if(rs.getString(5) != null)
					out.print(rs.getString(5));
				out.println("</td>");
				out.print("<td class='name'>");
				psForName = conn.prepareStatement("select name from avs11u0t where userid='"+rs.getString(5)+"'");
				rsForName = psForName.executeQuery();
				if(rsForName.next())
					out.print(rsForName.getString(1));
				if(psForName != null) psForName.close();
				if(rsForName != null) rsForName.close();
				out.println("</td>");
				out.println("</tr>");
			}
		}
		if(rs != null ) rs.close();
		if(ps != null) ps.close() ;
	}
	catch(SQLException e)
	{
		out.println("error "+e);
	}
	finally
	{
		if(psForName != null) psForName.close();
		if(rsForName != null) rsForName.close();
		if(rs != null) rs.close();
		if(conn != null) conn.close();
		if(ps != null) ps.close();
	}
%>