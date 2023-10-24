const router = require("express").Router();
const { handleError } = require("../../http/helpers/ErrorHandler");
const enrolleeService = require("../../services/EnrolleeService");

router.get("/synch", async (req, res) => {
    const enrolees = await enrolleeService.synchronizeData();

    res.json({
        enrolees
    })
});

router.use((err, req, res, next) => {
    handleError(err, req, res);
});

module.exports = router;