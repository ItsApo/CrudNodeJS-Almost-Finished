const controller = {};

controller.list = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM customer', (err, index) => {
      if (err) {
        res.json(err);
      }
      res.render('index', {
        data: index
      });
    });
  });
};

controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) =>{
        conn.query('INSERT INTO customer set ?', [data], (err, customer) => {
            console.log(customer);
            res.redirect('/');
        });
    })
};

controller.delete = (req, res) => {
    const { idcustom } = req.params;

    req.getConnection((err, conn) => {
        conn.query('DELETE FROM customer WHERE idcustom = ?', [idcustom], (err, rows) => {
            res.redirect('/');
        });
    })
};

controller.edit = (req, res) => {
    const { idcustom } = req.params;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM customer WHERE idcustom = ?', [idcustom], (err, customer) => {
            res.render('customer_edit', {
                data: customer[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { idcustom } = req.params;
    const newCustomer = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE customer set ? WHERE idcustom = ?', [newCustomer, idcustom], (err, rows) => {
            res.redirect('/');
        });
    });
}



module.exports = controller;

