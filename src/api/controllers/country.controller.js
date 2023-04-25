exports.getCountries = async (req, res, next) => {
  try {
    let countries = [
      {
        code: '91', country: 'IN', elt: 'India'
      },
      {
        code: '61', country: 'AU', elt: 'Australia'
      }
    ]
    res.json(countries)
  } catch (error) {
    return next(error);
  }
}