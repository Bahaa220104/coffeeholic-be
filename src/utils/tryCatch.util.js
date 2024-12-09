export default function tryCatch(controller) {
  return async (req, res, next) => {
    try {
      await controller(req, res, (err) => {
        console.log("ERROR: ", err.message);
        res.status(500).send(err.message);
      });
    } catch (err) {
      console.log("ERROR: ", err.message);
      res.status(500).send(err.message);
    }
  };
}
