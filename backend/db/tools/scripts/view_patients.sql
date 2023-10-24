DROP VIEW IF EXISTS vw_patients;

CREATE OR REPLACE VIEW vw_patients
AS
SELECT u.id,
  u."firstName",
  u."lastName",
  u."middleName",
  u.username,
  u.email,
  u.phone,
  u.gender,
  u.active,
  a."startDate",
  b."endDate",
  e."biometricId",
  e."hasBiometric",
  d."lastCheckIn"
FROM (select "adopteeId", min("startDate") "startDate"
  from adoptions
  group by "adopteeId") a
  join (select "adopteeId", max("endDate") "endDate"
  from adoptions
  group by "adopteeId") b
  on a."adopteeId" = b."adopteeId"
  JOIN users u ON u.id = a."adopteeId"
  JOIN enrollees e ON e."userId" = u.id
  left outer JOIN (select "userId", max("createdAt") "lastCheckIn"
  from patient_checkins
  group by "userId") d
  on u.id = d."userId"
WHERE a."startDate" <= now();