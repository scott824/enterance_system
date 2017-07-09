<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page import="java.net.*" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>


<%
	String workplace = URLDecoder.decode(request.getParameter("workplace"), "utf-8");
	String dutylist = URLDecoder.decode(request.getParameter("dutylist"), "utf-8");
	
	boolean isByung = false;
	if(workplace.indexOf("_b") > 0)
		isByung = true;
	
	out.println(workplace);
	String arr[] = dutylist.split(",");
	for(int i=0; i < arr.length; i++)
		out.println(arr[i]);
	
	StringBuffer query = new StringBuffer();
	int checkValue = 0;    //체크값 선언
	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;

	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);
		//	값이 있는지 검색
		query = new StringBuffer();
		query.append("select count(*) from enterance_duty where workplacecode = '"+workplace+"' and to_char(work_date,'yyyy') like '"+arr[0].substring(0, 4)+"' and to_char(work_date,'mm') like '"+arr[0].substring(5, 7)+"'");

		ps=conn.prepareStatement(query.toString());
		rs=ps.executeQuery();
		while(rs.next())
		{
			checkValue = rs.getInt(1);
		}
		if(rs != null ) rs.close();
		if(ps != null) ps.close();

		String plus_code = "";
		int plus_num = 0;
		int plus_seq = 0;
		ps = conn.prepareStatement("select plusworkplacecode, num, seq from ENTERANCE_ORDEREACHPLACESERIES where workplacecode = '"+ workplace.substring(0, 4) +"' and plusworkplacecode = '"+ workplace.substring(4, workplace.length()) +"'");
		rs = ps.executeQuery();
		while(rs.next()) {
			plus_code = rs.getString(1);
			plus_num = rs.getInt(2);
			plus_seq = rs.getInt(3);
		}
		if(rs!=null) rs.close();
		if(ps!=null) ps.close();

		out.println(plus_seq);
		// enterance_duty에서 값이 있으면 update문 없으면 insert문을 사용해 수정하기!
		
		if(checkValue > 1) {
			out.println("checkValue > 1");
			for(int j=0, i=0; j < arr.length/5; j++, i += 5) {
				if(plus_num == 2) {
					ps = conn.prepareStatement("update enterance_duty set gunbun=?, seqnumber=? where workplacecode=? and to_char(work_date,'yyyy/mm/dd/hh24')=? ");
					ps.setString(1, arr[i+3]);
					if(arr[i+2].compareTo("") != 0)
						ps.setInt(2, Integer.parseInt(arr[i+2]));
					else
						ps.setInt(2, 0);
					ps.setString(3, workplace);
					if(j%2 == 0)
						ps.setString(4, arr[i]+"/09");
					else
						ps.setString(4, arr[i]+"/18");

					ps.executeUpdate();
					if(ps != null) ps.close();
				}
				else {
					out.println("j : " + j);
					boolean isEqual = true;
					out.println("1" + arr[i] + arr[i+3]);
					ps = conn.prepareStatement("select gunbun from enterance_duty where workplacecode='"+workplace+"' and to_char(work_date, 'yyyy/mm/dd') like '"+arr[i]+"'");
					rs = ps.executeQuery();
					while(rs.next()) {
						if(rs.getString(1) != null) {
							if(rs.getString(1).compareTo(arr[i+3]) != 0)
								isEqual = false;
						}
						else
							if(arr[i+3] != null)
								isEqual = false;
					}
					if(rs != null) rs.close();
					if(ps != null) ps.close();
					
					out.println("isEqual = " + isEqual);
					if(plus_seq == 1)
						if(!isEqual) {
							Vector equal_sosok = new Vector();
							ps = conn.prepareStatement("select sosokcode from enterance_checker where workplacecode='"+workplace.substring(0, 4)+"' and to_char(workdate, 'yyyy/mm/dd') like '"+arr[i]+"' and equal=1");
							rs = ps.executeQuery();
							while(rs.next()) {
								equal_sosok.addElement(rs.getString(1));
							}
							if(rs != null) rs.close();
							if(ps != null) ps.close();
							out.println("2");
							if(equal_sosok.size() > 0) {
								for(int k=0; k < equal_sosok.size(); k++) {
									ps = conn.prepareStatement("update enterance_checker set equal=0 where workplacecode=? and to_char(workdate, 'yyyy/mm/dd') like ? and sosokcode=?");
									ps.setString(1, workplace.substring(0, 4));
									ps.setString(2, arr[i]);
									ps.setString(3, equal_sosok.elementAt(k).toString());
									ps.executeUpdate();
									if(ps!=null) ps.close();
								}
							}
						}

					ps = conn.prepareStatement("update enterance_duty set gunbun=?, seqnumber=? where workplacecode=? and to_char(work_date,'yyyy/mm/dd')=? ");
					ps.setString(1, arr[i+3]);
					if(arr[i+2].compareTo("") != 0)
						ps.setInt(2, Integer.parseInt(arr[i+2]));
					else
						ps.setInt(2, 0);
					ps.setString(3, workplace);
					ps.setString(4, arr[i]);

					ps.executeUpdate();
					if(ps != null) ps.close();
					out.println("3");
					out.println("");
				}
			}
		}
		else{
			out.println("checkValue == 0");
			for(int j=0, i=0; j < arr.length/5; j++, i += 5) {
				if(plus_num == 2) {
					if(arr[i+2].compareTo("") != 0) {
						ps = conn.prepareStatement("insert into enterance_duty (workplacecode, work_date, work_day, seqnumber, gunbun) values (?, to_date(?,'yyyy/mm/dd/hh24'), ?, ?, ?) ");
						ps.setString(1, workplace);
						if(j%2 == 0)
							ps.setString(2, arr[i]+"/09");
						else
							ps.setString(2, arr[i]+"/18");
						ps.setString(3, arr[i+1]);
						ps.setInt(4, Integer.parseInt(arr[i+2]));
						ps.setString(5, arr[i+3]);
					} else {
						ps = conn.prepareStatement("insert into enterance_duty (workplacecode, work_date, work_day, gunbun) values (?, to_date(?,'yyyy/mm/dd/hh24'), ?, ?) ");
						ps.setString(1, workplace);
						if(j%2 == 0)
							ps.setString(2, arr[i]+"/09");
						else
							ps.setString(2, arr[i]+"/18");
						ps.setString(3, arr[i+1]);
						ps.setString(4, arr[i+3]);
					}
					ps.executeUpdate();
					if(ps != null) ps.close();
					out.println(i+", "+j);
				}
				else {
					if(arr[i+2].compareTo("") != 0) {
						ps = conn.prepareStatement("insert into enterance_duty (workplacecode, work_date, work_day, seqnumber, gunbun) values (?, to_date(?,'yyyy/mm/dd'), ?, ?, ?) ");
						ps.setString(1, workplace);
						ps.setString(2, arr[i]);
						ps.setString(3, arr[i+1]);
						ps.setInt(4, Integer.parseInt(arr[i+2]));
						ps.setString(5, arr[i+3]);
					} else {
						ps = conn.prepareStatement("insert into enterance_duty (workplacecode, work_date, work_day, gunbun) values (?, to_date(?,'yyyy/mm/dd'), ?, ?) ");
						ps.setString(1, workplace);
						ps.setString(2, arr[i]);
						ps.setString(3, arr[i+1]);
						ps.setString(4, arr[i+3]);
					}
					ps.executeUpdate();
					if(ps != null) ps.close();
					out.println(i+", "+j);
				}
			}
			out.println(query);
		}
	}
	catch(Exception e) {
		out.println(query);
		out.println("error");
		out.println(e);
	}
	finally {
		if(rs != null) rs.close();
		if(conn != null) conn.close();
		if(ps != null) ps.close();
	}
%>