DROP VIEW IF EXISTS vw_doctors;

CREATE OR REPLACE VIEW vw_doctors
AS
SELECT
    u.id "userId", u."firstName", u."lastName", u."middleName", u.username, u.email, u.phone, u.gender, u.active,
    d.id "id", d."hospitalId", d."departmentId", d."idNumber", h.name hospital, hd.name department
FROM doctors d
    INNER JOIN users u
    ON u.id = d."userId"
    LEFT JOIN hospitals h
    ON d."hospitalId" = h.id
    LEFT JOIN hospital_departments hd
    ON d."departmentId" = hd.id