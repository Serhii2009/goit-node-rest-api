export const cntrlWrapper = (cntrl) => {
  const cntrlWithWrapper = async (req, res, next) => {
    try {
      await cntrl(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  return cntrlWithWrapper
}
