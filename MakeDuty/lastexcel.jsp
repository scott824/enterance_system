w<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page language = "java"%>
<%@ page import="java.sql.*, java.util.*, javax.servlet.http.*,
						   mil.af.alw10.common.jdbc.JDBCHelper
" %>

<%  //엑셀파일로 받기 위한 설정
	String workplace = request.getParameter("workplace");
	response.setHeader("Content-Disposition", "attachment; filename='"+ workplace+"'당직근무명령.xls");
	response.setHeader("Content-Description", "JSP Generated Data");
%>



<%
int j = 1;
//변수 선언
String date_year = request.getParameter("date_year");
String date_month = request.getParameter("date_month");
StringBuffer query = new StringBuffer();

//날짜 변수
Vector work_date = new Vector();
Vector work_day = new Vector();
Vector workplace = new Vector();

Vector b_work_date = new Vector();

//사관 정보
Vector sg_sosok = new Vector();
Vector sg_rank = new Vector();
Vector sg_name = new Vector();

//병사 정보
Vector b1_sosok = new Vector();
Vector b1_rank = new Vector();
Vector b1_name = new Vector();
Vector b2_sosok = new Vector();
Vector b2_rank = new Vector();
Vector b2_name = new Vector();


%>

<%
try{
conn = JDBCHelper.getConnection(JDBCHelper.A1);
query = new StringBuffer();
query.append("select code.workplace, duty.work_date, duty.work_day, d1t.ass, c1t.rankname, u0t.name");
query.append("from enterance_duty duty, avs11u0t u0t, avs11c1t c1t, avs11d1t d1t, ");
query.append("(select case length(sosokcode) when 6 THEN substr(sosokcode, 1, 2) when 8 ");
query.append("then substr(sosokcode, 1,6) when 10 then substr(sosokcode,1,8) when 12 ");
query.append("then substr(sosokcode,1,8) when 14 then substr(sosokcode,1,8) else "); query.append("substr(sosokcode,1,8) end sosokcode, userid from avs11u0t) sosokname,");
query.append("(select workplace, workplacecode from enterance_workplace_code) code ");
query.append("where code.workplacecode like '"+workplace+"' and to_char(duty.work_date, 'yyyy/mm') = '"+date_year+"/"+date_month+"' and duty.gunbun = u0t.userid and u0t.rankcode = c1t.rankcode ");
query.append("and sosokname.sosokcode = d1t.sosok_code and sosokname.userid = duty.gunbun");
query.append("order by duty.work_date");

ps = conn.prepareStatement(query.toString());
rs = ps.executeQuery();

while(rs.next()){
	workplace.addElement(rs.getString(1));
	work_date.addElement(rs.getString(2));
	work_day.addElement(rs.getString(3));
	sg_sosok.addElement(rs.getString(4));
	sg_rank.addElement(rs.getString(5));
	sg_name.addElement(rs.getString(6));
}
	if(rs != null) rs.close();
	if(ps != null) ps.close();


query = new StringBuffer();
query.append("select duty.work_date, d1t.ass, c1t.rankname, u0t.name");
query.append("from enterance_duty duty, avs11u0t u0t, avs11c1t c1t, avs11d1t d1t, (select case length(sosokcode) when 6 THEN substr(sosokcode, 1, 2) when 8 then substr(sosokcode, 1,6) when 10 then substr(sosokcode,1,8) when 12 then substr(sosokcode,1,8) when 14 then substr(sosokcode,1,8) else substr(sosokcode,1,8) end sosokcode, userid from avs11u0t) sosokname");
query.append(" where duty.workplacecode='"+workplace+"'_b and to_char(duty.work_date, 'yyyy/mm')  = '"+date_year+"/"+date_month+"' and ");
query.append("duty.gunbun = u0t.userid and u0t.rankcode = c1t.rankcode and sosokname.sosokcode = d1t.sosok_code");
query.append("sosokname.userid = duty.gunbun order by duty.work_date");

ps = conn.prepareStatement(query.toString());
rs = ps.executeQuery();

while(rs.next()){
	b_work_date.addElement(rs.getString(1));
	b1_sosok.addElement(rs.getString(2));
	b1_rank.addElement(rs.getString(3));
	b1_name.addElement(rs.getString(4));
}
	if(rs != null) rs.close();
	if(ps != null) ps.close();

if(b_work_date.size() > 32){
for(int k=0; k<b_work_date.size(); k++){
	j += 2
	b2_sosok.addElement(b1_sosok.elementAt(j));
	b2_rank.addElement(b1_rankname.elementAt(j));
	b2_name.addElement(b1_name.elementAt(j));
	}
}
%>


<html>
	<head>
		<style>
		body {
	font-family: 함초롬돋음;
	}
		</style>
	</head>
<body>
<table border='1'>
	<tr align='center' style='width: 143px heigth: 58px'>
		<td colspan='7'><FONT SIZE='5'><STRONG><U> <%=date_year%>년 <%=date_month%>월
		<%=workplace.elementAt(1)%> 당직근무 명령</U></STRONG></FONT></td>
	</tr>

	<tr align='center' style='background-color: #eef; border-bottom: 2px dashed black; width: 143px'>
		<td style='width: 98px'><STRONG>근 무 지</STRONG></td>
		<td style='width: 53px'><STRONG>요 일</STRONG></td>
		<td colspan='2'><STRONG>당직근무자</STRONG></td>
		<td colspan='3'><STRONG>당직병</STRONG></td>
	</tr>
<%
	for(int i=0; i < work_date.size(); i++){
	
	if(work_day.elementAt(i).toString().compareTo("일") == 0 || work_day.elementAt(i).toString().compareTo("토") == 0)
		out.println("<tr align='center' style='background-color: #faa height: 53px'>");
	}
	else if(work_day.elementAt(i).toString().compareTo("금") == 0)
		out.println("<tr align='center' style='background-color: #ffa height: 53px'>");
	else
		out.println("<tr align='center' style='height: 53px'>");
%>
	<td rowspan ='2' style ='width: 98px'><%=work_date.elementAt(i).toString().substring(0,2)%>월<%=work_date.elementAt(i).toString().substring(2,4)%>일</td>
	<td rowspan='2' style='width: 53'><%=work_day.elementAt(i)%></td>
	<td rowspan='2' style='width: 79px'><%=sg_sosok.elementAt(i)%></td>
	<td rowspan='2' style='width: 143px'><%=sg_rank.elementAt(i)%>
	<%=sg_name.elementAt(i)%></td>
<%
for(int l=0; l < b_work_date.size(); l++){
	<td style='widthL 60px'><%=b1_%>
}
%>
<%
		}
	catch(SQLException e) {
		out.println(e.toString());
	}
	finally {
		if(ps != null) ps.close();
		if(rs != null) rs.close();
		if(conn != null) conn.close();
	}

		%>