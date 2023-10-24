DROP VIEW IF EXISTS vw_donors;

CREATE OR REPLACE VIEW vw_donors
AS
SELECT
    u.id, u."firstName", u."lastName", u."middleName", u.username, u.email, u.phone, u.gender, u."birthDate",
    u.address, u.nationality, u.active, u."publicProfile", u."officeAddress", u."officePhone", u."stateId", u."lgaId", u."registrationCode",
    d."residentAddress", d."adoptionGoalCount", d."adoptionGoalAmount", st.name "residentState", lga.name "residentLga", d."biometricId"
FROM users u
    INNER JOIN donors d
    ON u.id = d."userId"
    LEFT JOIN states st
    ON d."residentStateId" = st.id
    LEFT JOIN lgas lga
    ON d."residentLgaId" = lga.id