module.exports = {
  isFromBrowser (req) {
    return 'origin' in req.headers
  }
}
