<%@ page contentType="text/html; charset=euc-kr" %>
<%@ page import="mil.af.alw10.common.jdbc.JDBCHelper" %>
<%@ page import="java.net.*" %>
<%@ page language="java" import="java.sql.*,java.util.*,javax.servlet.http.* "%>


<%@ include file="../../userInfoAndLog.jspf" %>

<%!
	public int indexOf(String find, String arr[]) {
		for(int i=0; i < arr.length; i++) {
			if(find.equals(arr[i]))
				return i;
		}
		return -1;
	}
%>

<%
	String tableName = request.getParameter("tableName");
	String pageLocation = request.getParameter("pageLocation");

	String columnNames[] = request.getParameter("columnNames").split(",");					// DB column names which will modify
	String logColumnNames[] = request.getParameter("logColumnNames").split(",");			// DB column names which will print in log
	String logColumnKoreanNames[] = request.getParameter("logColumnKoreanNames").split(",");// interprete version of column names which will print in log
	
	String series[] = URLDecoder.decode(request.getParameter("series"), "utf-8").split(",");
	String deletedData[] = URLDecoder.decode(request.getParameter("deletedData"), "utf-8").split(",");
	String addedData[] = URLDecoder.decode(request.getParameter("addedData"), "utf-8").split(",");
	String modifiedFrom[] = URLDecoder.decode(request.getParameter("modifiedFrom"), "utf-8").split(",");
	String modifiedTo[] = URLDecoder.decode(request.getParameter("modifiedTo"), "utf-8").split(",");
	
	/* prints */
	{
		out.println("series");
		for(int i=0; i < series.length; i++)
			out.println(series[i]);
		
		out.println("\n deletedData");
		for(int i=0; i < deletedData.length; i++)
			out.println(deletedData[i]);
		
		out.println("\n addedData");
		for(int i=0; i < addedData.length; i++)
			out.println(addedData[i]);
		
		out.println("\n modifiedFrom");
		for(int i=0; i < modifiedFrom.length; i++)
			out.println(modifiedFrom[i]);
		
		out.println("\n modifiedTo");
		for(int i=0; i < modifiedTo.length; i++)
			out.println(modifiedTo[i]);
		out.println("data end");
	}
	

	Connection conn = null;
	PreparedStatement ps = null;
	ResultSet rs = null;

	try {
		conn = JDBCHelper.getConnection(JDBCHelper.A1);

		/* delete Data */
		for(int i=0; i < deletedData.length/series.length; i++) {
			String query = "delete from enterance_"+tableName+" where ";
			String explanation = "삭제! ";

			for(int j=0; j < columnNames.length; j++) {
				query += columnNames[j] + " = ? ";
				explanation += logColumnKoreanNames[j] + " : ?";
				if(j != columnNames.length-1) {
					query += "and ";
					explanation += ", ";
				}
			}

			ps = conn.prepareStatement(query);

			for(int j=0; j < columnNames.length; j++) {
				int index = indexOf(columnNames[j], series);
				ps.setString(j+1, deletedData[i*series.length + index]);
			}

			ps.executeUpdate();
			if(ps != null)	ps.close();

			for(int j=0; j < columnNames.length; j++) {
				int index = indexOf(columnNames[j], series);
				int index2;
				query = query.replaceFirst("\\?", deletedData[i*series.length + index]);
				if((index2 = indexOf(logColumnNames[j], series)) != -1)
					explanation = explanation.replaceFirst("\\?", deletedData[i*series.length + index2]);
				else
					explanation = explanation.replaceFirst("\\?", deletedData[i*series.length + index]);
			}

			log.insertLog(pageLocation, query, explanation);
		}

		/* add Data */
		for(int i=0; i < addedData.length/series.length; i++) {
			String query = "insert into enterance_"+tableName+" (";
			String explanation = "추가! ";

			for(int j=0; j < columnNames.length; j++) {
				query += columnNames[j];
				explanation += logColumnKoreanNames[j] + " : ?";
				if(j != columnNames.length-1) {
					query += ", ";
					explanation += ", ";
				}
			}
			query += ") values (";
			for(int j=0; j < columnNames.length; j++) {
				query += "?";
				if(j != columnNames.length-1) {
					query += ", ";
				}
			}
			query += ") ";

			ps = conn.prepareStatement(query);
			for(int j=0; j < columnNames.length; j++) {
				int index = indexOf(columnNames[j], series);
				ps.setString(j+1, addedData[i*series.length + index]);
			}

			ps.executeUpdate();
			if(ps != null)	ps.close();

			for(int j=0; j < columnNames.length; j++) {
				int index = indexOf(columnNames[j], series);
				int index2;
				query = query.replaceFirst("\\?", addedData[i*series.length + index]);
				if((index2 = indexOf(logColumnNames[j], series)) != -1)
					explanation = explanation.replaceFirst("\\?", addedData[i*series.length + index2]);
				else
					explanation = explanation.replaceFirst("\\?", addedData[i*series.length + index]);
			}
			log.insertLog(pageLocation, query, explanation);
		}

		/* modify Data */
		if(modifiedFrom.length == modifiedTo.length) {
			for(int i=0; i < modifiedFrom.length/series.length; i++) {
				String query = "update enterance_" + tableName + " set ";
				String explanation = "수정! ";

				for(int j=0; j < columnNames.length; j++) {
					query += columnNames[j] + " = ?";
					explanation += logColumnKoreanNames[j] + " : ?";
					if(j != columnNames.length-1) {
						query += ", ";
						explanation += ", ";
					}
				}
				query += " where ";
				explanation += " <- ";
				for(int j=0; j < columnNames.length; j++) {
					query += columnNames[j] + " = ? ";
					explanation += logColumnKoreanNames[j] + " : ?";
					if(j != columnNames.length-1) {
						query += "and ";
						explanation += ", ";
					}
				}

				ps = conn.prepareStatement(query);

				for(int j=0; j < columnNames.length; j++) {
					int index = indexOf(columnNames[j], series);
					ps.setString(j+1, modifiedTo[i*series.length + index]);
				}
				for(int j=0; j < columnNames.length; j++) {
					int index = indexOf(columnNames[j], series);
					ps.setString(j+1+columnNames.length, modifiedFrom[i*series.length + index]);
				}

				ps.executeUpdate();
				if(ps != null)	ps.close();
				
				for(int j=0; j < columnNames.length; j++) {
					int index = indexOf(columnNames[j], series);
					int index2;
					query = query.replaceFirst("\\?", modifiedTo[i*series.length + index]);
					if((index2 = indexOf(logColumnNames[j], series)) != -1)
						explanation = explanation.replaceFirst("\\?", modifiedTo[i*series.length + index2]);
					else
						explanation = explanation.replaceFirst("\\?", modifiedTo[i*series.length + index]);
				}
				for(int j=0; j < columnNames.length; j++) {
					int index = indexOf(columnNames[j], series);
					int index2;
					query = query.replaceFirst("\\?", modifiedFrom[i*series.length + index]);
					if((index2 = indexOf(logColumnNames[j], series)) != -1)
						explanation = explanation.replaceFirst("\\?", modifiedFrom[i*series.length + index2]);
					else
						explanation = explanation.replaceFirst("\\?", modifiedFrom[i*series.length + index]);
				}
				log.insertLog(pageLocation, query, explanation);
			}
		}
	}
	catch(Exception e) {
		out.println("error " + e);
	}
	finally {
		if(rs != null) rs.close();
		if(ps != null) ps.close();
		if(conn != null) conn.close();
	}
%>