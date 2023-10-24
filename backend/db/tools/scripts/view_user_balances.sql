DROP VIEW IF EXISTS vw_userbalances;


CREATE OR REPLACE VIEW vw_userbalances
AS
select a."userId", b.id as "planId", b.type, sum(amount) amount
from wallet a join adoption_rates b on a."planId" = b.id
group by a."userId",b.id,b.type