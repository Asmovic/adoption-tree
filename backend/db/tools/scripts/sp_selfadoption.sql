create or replace procedure process_self_adoption(p_requestid int, p_userid int,p_duration varchar)
LANGUAGE plpgsql 
AS $$
DECLARE
	p_startdate date;
	p_enddate date;
BEGIN
	select COALESCE ((max("endDate")) + interval '1 days',current_date) into p_startdate from adoptions where "adopteeId" = p_userid;
	select getEndDate(p_startdate,p_duration) into p_enddate;
	insert into adoptions("adoptionRequestId","adopteeId","startDate","endDate",completed)
	values (p_requestid,p_userid,p_startdate,p_enddate,false);
	
	update adoption_requests set "noOfAdoptedPersons" = COALESCE("noOfAdoptedPersons",0) + 1
	where id = p_requestid;
END $$