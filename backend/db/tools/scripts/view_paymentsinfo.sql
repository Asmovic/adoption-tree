DROP VIEW IF EXISTS vw_payments;

CREATE OR REPLACE VIEW vw_payments
AS
SELECT
    a."paymentId", a."durationType", p."paymentDate", p.amount, a."noOfAdoptees", a.type, p."synchStatus",
    e."biometricId" "enrolleeId", d."biometricId" "donorId", a.category
FROM adoption_requests a JOIN payments p ON a."paymentId"=p.id AND p.status='success' AND "paymentId" IS NOT NULL
    LEFT OUTER JOIN enrollees e ON a."userId" = e."userId"
    LEFT OUTER JOIN donors d ON a."userId" = d."userId"