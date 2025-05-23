const router = require("express").Router();
const eventoController = require("../controllers/eventoController");

router
  .route("/create_evento")
  .post((req, res) => eventoController.criar_evento(req, res));
router
  .route("/get_eventos")
  .post((req, res) => eventoController.buscar_eventos(req, res));
router
  .route("/get_evento_host")
  .post((req, res) => eventoController.buscar_evento_host(req, res));
router
  .route("/update_evento")
  .put((req, res) => eventoController.atualizar_evento(req, res));
router
  .route("/update_subhosts_evento")
  .put((req, res) => eventoController.atualizar_subhosts_evento(req, res));
router
  .route("/cancel_evento")
  .put((req, res) => eventoController.cancelar_evento(req, res));
router
  .route("/lote_ingresso")
  .put((req, res) => eventoController.alterar_lote_ingresso(req, res));
router
  .route("/buscar")
  .post((req, res) => eventoController.buscar_evento_titulo(req, res));
router
  .route("/evento")
  .post((req, res) => eventoController.buscar_evento_publico(req, res));

module.exports = router;
