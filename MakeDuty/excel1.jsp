<%@ page contentType="text/html; charset=KSC5601" %>
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
//변수 선언
String date_year = request.getParameter("date_year");
String date_month = request.getParameter("date_month");
StringBuffer query = new StringBuffer();
String workplace_name = null;


Vector pluscode = new Vector();
Vector plusworkplace = new Vector();
Vector v_work_place = new Vector();
Vector v_work_date = new Vector();
Vector v_work_day = new Vector();
Vector v_seqnumber = new Vector();
Vector v_work_name = new Vector();
Vector sg_rankname = new Vector();
Vector sg_name = new Vector();
Vector b_work_name = new Vector();
Vector b_name = new Vector();
Vector b_rankname = new Vector();
Vector il_name = new Vector();
Vector il_rankname = new Vector();
Vector sr_name = new Vector();
Vector sr_rankname = new Vector();
Vector srb_name = new Vector();
Vector srb_rankname = new Vector();




if(workplace.subString(4,6)
Connection conn = null;
PreparedStatement ps = null;
ResultSet rs = null;
//개수 새는곳
try {
	int lengthcount = 0;
	
	conn = JDBCHelper.getConnection(JDBCHelper.A1);
	
	query = new StringBuffer();
	query.append("select workplacecode||''||plusworkplacecode, plusworkplacecode from ENTERANCE_ORDEREACHPLACESERIES where workplacecode = '"+workplace+"' order by seq");
	
	ps=conn.prepareStatement(query.toString());
	rs=ps.executeQuery();

	while(rs.next()){
		plusworkplace.addElement(rs.getString(1));
		pluscode.addElement(rs.getString(2));
	}
	if(rs != null) rs.close();
	if(ps != null) ps.close();

	for(int j=0; j < plusworkplace.size(); j++){

	query = new StringBuffer();
	query.append("select workplacecode, to_char(work_date,'mmdd') , work_day, seqnumber, gunbun ");
	query.append("from enterance_duty where workplacecode = '"+plusworkplace.elementAt(j)+"' and to_char(work_date,'yyyy') like '"+ date_year +"' and to_char(work_date,'mm') like '"+ date_month +"' order by work_date asc");
	
	ps=conn.prepareStatement(query.toString());
	rs=ps.executeQuery();

	
	while(rs.next()){
		v_work_date.addElement(rs.getString(2));
		v_work_day.addElement(rs.getString(3));
		v_seqnumber.addElement(rs.getString(4));
		v_work_name.addElement(rs.getString(5));
	}
	if(rs != null ) rs.close();
	if(ps != null) ps.close() ;


	query = new StringBuffer();
	query.append("select workplace from enterance_workplace_code where workplacecode = '"+workplace+"'");

	ps=conn.prepareStatement(query.toString());
	rs=ps.executeQuery();

	while(rs.next()){
		workplace_name = rs.getString(1);
	}
	if(rs != null) rs.close();
	if(ps != null) ps.close();


	
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
		<td colspan='7'><FONT SIZE='5'><STRONG><U> <%=date_year%>년 <%=date_month%>월 <%=workplace_name%> 당직근무 명령</U></STRONG></FONT></td>
	</tr>
	<tr align='center' style='background-color: #eef; border-bottom: 2px dashed black; width: 143px'>
		<td style='width: 98px'><STRONG>날 짜</STRONG></td>
		<td style='width: 53px'><STRONG>요일</STRONG></td>
<%
	if(plusworkplace.elementAt(j).toString.substring(4,6).compareTo("_sg") == 0){
	out.println("<td colspan='2'><STRONG>당직사관</STRONG></td>");
	out.println("<td colspan='3''><STRONG>당직병</STRONG></td></tr>");
}
	else if(plusworkplace.elementAt(j).toString.substring(4,6).compareTo("_il") == 0)
	out.println("<td colspan='2'><STRONG>일직사관</STRONG></td></tr>");

	else if(plusworkplace.elementAt(j).toString.substring(4,6).compareTo("_sr") == 0){
	out.println("<td colspan='2'><STRONG>당직사령</STRONG></td>");
	out.println("<td colspan='2'><STRONG>당직사령부관</STRONG></td>");
	out.println("<td colspan='2'><STRONG>당직사령병</STRONG></td>");
	}

	
	
	
	%>

<%for(int i=0; i < v_work_date.size(); i++)
{

	query = new StringBuffer();
	query.append("select a.name, b.rankname from avs11u0t a, avs11c1t b where a.userid = '"+v_work_name.elementAt(i)+"' and a.rankcode = b.rankcode");
	
	ps=conn.prepareStatement(query.toString());
	rs=ps.executeQuery();
	

	for(int v=0; v < plusworkplace.size(); v++){
	if(plusworkplace.elementAt(v).toString.substring(4,5).compareTo("_b") == 0{
	while(rs.next()){
		b_name.addElement(rs.getString(1));
		b_rankname.addElement(rs.getString(2));
	}
}
	
	else if(plusworkplace.elementAt(v).toString.substring(4,6).compareTo("_sg") == 0){
	while(rs.next()){
		sg_name.addElement(rs.getString(1));
		sg_rankname.addElement(rs.getString(2));
	}
}

	else if(plusworkplace.elementAt(v).toString.substring(4,6).compareTo("_il") == 0){
	while(rs.next()){
		il_name.addElement(rs.getString(1));
		il_rankname.addElement(rs.getString(2));
	}
}
	else if(plusworkplace.elementAt(v).toString.substring(4,6).compareTo("_sr") == 0){
	while(rs.next()){
		sr_name.addElement(rs.getString(1));
		sr_rankname.addElement(rs.getString(2));
	}
}
	else{
	while(rs.next()){
		srb_name.addElement(rs.getString(1));
		srb_rankname.addElement(rs.getString(2));
	}
}
	if(rs != null) rs.close();
	if(ps != null) ps.close();



	if(v_work_day.elementAt(i).toString().compareTo("일") == 0 || v_work_day.elementAt(i).toString().compareTo("토") == 0)
		out.println("<tr align='center' style='background-color: #faa height: 53px'>");
	else if(v_work_day.elementAt(i).toString().compareTo("금") == 0)
		out.println("<tr align='center' style='background-color: #ffa height: 53px'>");
	else
		out.println("<tr align='center' style='height: 53px'>");
%>

		
		<td rowspan='2' style='width: 98px'><%=v_work_date.elementAt(i).toString().substring(0, 2)%>월<%=v_work_date.elementAt(i).toString().substring(2, 4)%>일
		</td>
		
		<td rowspan='2' style='width: 53px'><%=v_work_day.elementAt(i)%></td>
		
		<td rowspan='2' style='width: 79px'><%=v_seqnumber.elementAt(i)%></td>
		<td rowspan='2' style='width: 143px'><%=v_rankname.elementAt(i)%> <%=v_name.elementAt(i)%></td>
		<td style='width: 60px'>gg</td>
		<td style='width: 50px'>gg</td>
		<td style='width: 143px'>gg</td>
		</tr>
		
	
	<%
	if(v_work_day.elementAt(i).toString().compareTo("일") == 0 || v_work_day.elementAt(i).toString().compareTo("토") == 0)
		out.println("<tr align='center' style='background-color: #faa width: 60px height: 28px'>");
	else if(v_work_day.elementAt(i).toString().compareTo("금") == 0)
		out.println("<tr align='center' style='background-color: #ffa width: 50px height: 28px'>");
	else
		out.println("<tr align='center' style='width: 143px height: 28px'>");%>
		<td>gg</td><td>gg</td><td>gg</td>
	</tr>
	<%

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
</table>
</body>
</html>


