create or replace function getEndDate (p_startdate date,p_duration varchar)
returns date
language plpgsql
  as
$$
declare 
  end_date date;
begin
 	case 
 	when p_duration = 'daily' then
 		end_date := p_startdate + interval '1 days';
	when p_duration = 'weekly' then
 		end_date := p_startdate + interval '7 days';
	when p_duration = 'monthly' then
 		end_date := p_startdate + interval '1 months';
	when p_duration = 'onetime' then
 		end_date := p_startdate + interval '1 years';
	else
		-- do nothing
 	end case;
  	return end_date;
end;
$$ 