DROP VIEW IF EXISTS vw_enrollees;
CREATE
OR REPLACE VIEW vw_enrollees AS
SELECT
  u.id,
  u."firstName",
  u."lastName",
  u."middleName",
  u.username,
  u.email,
  u.phone,
  u.gender,
  u."birthDate",
  u.address,
  u.nationality,
  u.active,
  u."publicProfile",
  u."officeAddress",
  u."officePhone",
  u."stateId",
  u."lgaId",
  u."registrationCode",
  e.id "enrolleeId",
  e."biometricId",
  e."nokFirstName",
  e."nokLastName",
  e."nokPhone",
  e."nokAddress",
  e."genotypeId",
  e."religionId",
  e."hasBiometric",
  bg."value" "bloodGroup",
  gen."value" genotype,
  rel."value" religion,
  nok."value" "nokRelationShip",
  hos."name" hospital,
  lgas."name" lga,
  a."startDate", b. "endDate", e."hospitalId"
FROM
  users u
  LEFT OUTER JOIN (select "adopteeId", min("startDate") "startDate"
  from adoptions
  group by "adopteeId") a on u.id = a."adopteeId"
  LEFT OUTER JOIN (select "adopteeId", max("endDate") "endDate"
  from adoptions
  group by "adopteeId") b on a."adopteeId" = b."adopteeId"
  INNER JOIN enrollees e ON u.id = e."userId"
  LEFT JOIN blood_groups bg ON e."bloodGroupId" = bg.id
  LEFT JOIN genotypes gen ON e."genotypeId" = gen.id
  LEFT JOIN religions rel ON e."religionId" = rel.id
  LEFT JOIN nok_relationships nok ON e."nokRelationshipId" = nok.id
  LEFT JOIN hospitals hos ON e."hospitalId" = hos.id
  LEFT JOIN lgas ON u."lgaId" = lgas.id;