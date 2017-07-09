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

Vector sg_sosok = new Vector();
Vector sg_work_place = new Vector();
Vector sg_work_date = new Vector();
Vector sg_work_day = new Vector();
Vector sg_work_name = new Vector();
Vector sg_name = new Vector();
Vector sg_rankname = new Vector();
Vector bm_work_name = new Vector();
Vector bm_name = new Vector();
Vector bm_rankname = new Vector();
Vector bm_workdate = new Vector();
Vector bd_name = new Vector();
Vector bd_rankname = new Vector();
Vector bd_workdate = new Vector();
int workdate_count=1;



if(workplace.substring(0,1).compareTo("PS")==0)
	<%=sgPrint()%>
<%else if(workplace.substring(0,1).compareTo("PD")==0)
	<%=ilPrint()%>
<%else if(workplace.substring(0,1).compareTo("AL")==0)
	<%=srPrint()%>
%>
<%
Connection conn = null;
PreparedStatement ps = null;
ResultSet rs = null;
//개수 새는곳
try {
	int lengthcount = 0;
	public String sgPrint(){
		conn = JDBCHelper.getConnection(JDBCHelper.A1);
		query = new StringBuffer();
		query.append("select duty.work_date, duty.work_day, worker.ent_rank, worker.name from enterance_duty duty, enterance_worker worker where duty.workplacecode = '"+workplace+"_sg' and duty.gunbun = worker.gunbun");
		
		ps=conn.prepareStatement(query.toString());
		rs=ps.executeQuery();

		while(rs.next()){
		sg_work_date.addElement(rs.getString(1));
		sg_work_day.addElement(rs.getString(2));
		sg_rankname.addElement(rs.getString(3));
		sg_name.addElement(rs.getString(4));
		}
		if(rs != null ) rs.close();
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
		<td colspan='2'><STRONG>당직사관</STRONG></td>
		<td colspan='3''><STRONG>당직병</STRONG></td>
	</tr>
<%
for(int i=0; i < sg_work_date.size(); i++){

	if(v_work_day.elementAt(i).toString().compareTo("일") == 0 || v_work_day.elementAt(i).toString().compareTo("토") == 0)
		out.println("<tr align='center' style='background-color: #faa height: 53px'>");
	else if(v_work_day.elementAt(i).toString().compareTo("금") == 0)
		out.println("<tr align='center' style='background-color: #ffa height: 53px'>");
	else
		out.println("<tr align='center' style='height: 53px'>");
%>
		<td rowspan='2' style='width: 98px'><%=sg_work_date.elementAt(i).toString().substring(0, 2)%>월<%=sg_work_date.elementAt(i).toString().substring(2, 4)%>일
		</td>
		
		<td rowspan='2' style='width: 53px'><%=sg_work_day.elementAt(i)%></td>
		
		<td rowspan='2' style='width: 79px'><%=sg_rankname.elementAt(i)%> <%=sg_name.elementAt(i)%></td>
		
<%
			} 
%>
<%}%>
<%
	
	while(rs.next()){
		plusworkplace.addElement(rs.getString(1));
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
}

	query = new StringBuffer();
	query.append("select workplace from enterance_workplace_code where workplacecode = '"+workplace+"'");

	ps=conn.prepareStatement(query.toString());
	rs=ps.executeQuery();

	while(rs.next()){
		workplace_name = rs.getString(1);
	}
	if(rs != null) rs.close();
	if(ps != null) ps.close();

	query = new StringBuffer();
	query.append("select duty.workplacecode, duty.work_date, d1t.ass, c1t.rankname, u0t.name ");
	query.append("from enterance_duty duty, avs11u0t u0t, avs11c1t c1t, avs11d1t d1t, (select case length(sosokcode) when 6 THEN substr(sosokcode, 1, 2) when 8 then substr(sosokcode, 1,6) when 10 then substr(sosokcode,1,8) when 12 then substr(sosokcode,1,8) when 14 then substr(sosokcode,1,8) else substr(sosokcode,1,8) end sosokcode, userid from avs11u0t) sosokname ");
	query.append("where duty.workplacecode like '"+workplace+"_b' and ");
	query.append("to_char(duty.work_date, 'yyyy/mm/HH') like '"+date_year+"/"+date_month+"/09' and ");
	query.append("duty.gunbun = u0t.userid and ");
	query.append("u0t.rankcode = c1t.rankcode and ");
	query.append("sosokname.sosokcode = d1t.sosok_code and ");
	query.append("sosokname.userid = duty.gunbun ");
	query.append("order by duty.work_date");

	ps=conn.prepareStatement(query.toString());
	rs=ps.executeQuery();
	
	while(rs.next()){
		bm_workdate.addElement(rs.getString(2));
		bm_work_name.addElement(rs.getString(3));
		bm_rankname.addElement(rs.getString(4));
		bm_name.addElement(rs.getString(5));
	}
	if(rs !=null) rs.close();
	if(ps !=null) ps.close();

	
%>


<%for(int i=0; i < v_work_date.size(); i++)
	{

	query = new StringBuffer();
	query.append("select a.name, b.rankname from avs11u0t a, avs11c1t b where a.userid = '"+v_work_name.elementAt(i)+"' and a.rankcode = b.rankcode");
	
	ps=conn.prepareStatement(query.toString());
	rs=ps.executeQuery();

	while(rs.next()){
		v_name.addElement(rs.getString(1));
		v_rankname.addElement(rs.getString(2));
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
		

<%	
	for(int j = 0; j < bm_workdate.size(); j++){
	
	if(workdate_count % 2 == 1){
%>		
		
		<td style='width: 60px'><%=bm_work_name.elementAt(j)%></td>
		<td style='width: 50px'><%=bm_rankname.elementAt(j)%></td>
		<td style='width: 143px'><%=bm_name.elementAt(j)%></td>
		
<%
	}else if(workdate_count % 2 == 0 ){
%>		

		<td><%=bm_work_name.elementAt(j)%></td>
		<td><%=bm_rankname.elementAt(j)%></td>
		<td><%=bm_name.elementAt(j)%></td>
</tr>

<%
	}

%>
	<%
	workdate_count += 1;
	}
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


