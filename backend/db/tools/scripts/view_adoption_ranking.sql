DROP VIEW IF EXISTS vw_adoption_ranking;

CREATE OR REPLACE VIEW vw_adoption_ranking
AS
SELECT
    RANK () OVER (
ORDER BY
    "totalRequests" DESC ) AS RANK,
    "userId",
    "totalAdoptees",
    "totalRequests",
    "totalAmount"
FROM
    (
        SELECT
            MIN ( "userId" ) AS "userId",
            SUM ( "noOfAdoptees" ) AS "totalAdoptees",
            COUNT ( * ) AS "totalRequests",
            SUM ( "totalAmount") AS "totalAmount"
        FROM
            adoption_requests
        GROUP BY
            "userId"
    )
    A
ORDER BY
    RANK
