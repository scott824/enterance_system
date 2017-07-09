<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>


<%
	String name = request.getParameter("name");
	String isByung = request.getParameter("isByung");

	StringBuffer query = new StringBuffer();
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;

	String querySosok = new String();
	String SosokName = new String();
	PreparedStatement psSosok = null;
	ResultSet rsSosok = null;

	try
	{
		conn = JDBCHelper.getConnection(JDBCHelper.A1);
		
		if(isByung.compareTo("false") == 0)
			query.append("select userid, sosokcode, rankcode, name, userid from avs11u0t where name like '%"+name+"%' and sosokcode not like '%ZZ'") ;
		else
			query.append("select userid, sosokcode, rankcode, name, userid from avs11u0t where name like '%"+name+"%' and sosokcode like '%ZZ'") ;

		ps=conn.prepareStatement(query.toString());
		rs=ps.executeQuery();

		out.print("5,userid,per_code,sosokname,rank,name");
		while(rs.next()) {
			
			querySosok = "select distinct ass from avs11d1t where sosok_code like (select distinct case length(sosokcode) when 6 THEN substr(sosokcode, 1, 2) when 8 then substr(sosokcode, 1,6) when 10 then substr(sosokcode,1,8) when 12 then substr(sosokcode,1,8) when 14 then substr(sosokcode,1,8) else substr(sosokcode,1,8) end from avs11u0t where userid = '"+rs.getString(5)+"')";
			psSosok = conn.prepareStatement(querySosok.toString());
			rsSosok = psSosok.executeQuery();
			if(rsSosok.next()) {
				SosokName = rsSosok.getString(1);
			}
			if(rsSosok != null) rsSosok.close();
			if(psSosok != null) psSosok.close();
			if(SosokName.compareTo("") == 0)
				SosokName = "대외부서";
			out.print("," + rs.getString(1));
			out.print("," + rs.getString(2)+ "," + SosokName);
			psSosok = conn.prepareStatement("select rankname from avs11c1t where rankcode = '"+rs.getString(3)+"' ");
			rsSosok = psSosok.executeQuery();
			if(rsSosok.next()) {
				out.print("," + rsSosok.getString(1));
			}
			if(rsSosok != null) rsSosok.close();
			if(psSosok != null) psSosok.close();
			out.print("," + rs.getString(4));
		}
		if(rs != null ) rs.close();
		if(ps != null) ps.close() ;
	}
	catch(Exception e)
	{
		out.println("error\n" + e);
	}
	finally
	{
		if(rs != null) rs.close();
		if(conn != null) conn.close();
		if(ps != null) ps.close();

		if(rsSosok != null) rsSosok.close();
		if(psSosok != null) psSosok.close();
	}
%>