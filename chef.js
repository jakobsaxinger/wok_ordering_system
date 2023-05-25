$(document).ready(function() {
  var active_order_id = 0;
  var orders = [];
  loadOrders();
  setTimeout(() => {
    if (orders.length > 0){
      active_order_id = orders[0].id;
      displayOrderDetails(orders[0]);
    }
  },100);
  setInterval(loadOrders, 10000); // Alle 10 Sekunden aktualisieren

  function loadOrders() {
    $.ajax({
      url: 'http://localhost:8000/orders',
      method: 'GET',
      success: function(response) {
        active_orders = []
        for (var i = 0; i < response.length; i++) {
          if (!response[i].done) {
            active_orders.push(response[i]);
          }
        }
        orders = active_orders;
        displayOrders();
      },
      error: function(xhr, status, error) {
        console.log('Fehler beim Laden der Bestellungen:', error);
      }
    });
  }

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }

    return true;
  }

  function displayOrders() {
    var ordersContainer = $('#orders');
    ordersContainer.addClass('list-group')
    ordersContainer.empty();

    for (var i = 0; i < orders.length; i++) {
      var order = orders[i];
      if (!order.done) { // Nur offene Bestellungen anzeigen
        var orderItem = $('<div class="order-item list-group-item">');
        if (order.id === active_order_id) {
          orderItem.addClass('active');
        }
        orderItem.text('Bestellung: ' + order.id + '   ');
        orderItem.append($('<b>').text(order.name))
        orderItem.data('order', order);
        orderItem.data('order-id', order.id);
        orderItem.click(function() {
          displayOrderDetails($(this).data('order'));
        });

        ordersContainer.append(orderItem);
      }
    }

    // Automatisch die nächste Bestellung anzeigen
    // if (orders.length > 0) {
    //   var nextOrder = orders.find(order => !order.done); // Nächste offene Bestellung finden
    //   if (nextOrder) {
    //     displayOrderDetails(nextOrder);
    //     $('.order-item').removeClass('active');
    //     $('.order-item:contains("' + nextOrder.name + '")').addClass('active');
    //   } else {
    //     // Keine offenen Bestellungen vorhanden
    //     $('#orderDetails').empty();
    //   }
    // } else {
    //   // Keine Bestellungen vorhanden
    //   $('#orderDetails').empty();
    // }
  }

  function displayOrderDetails(order) {
    active_order_id = order.id;
    $('.order-item').removeClass('active');
    $('.order-item:contains("' + order.name + '")').addClass('active');

    var orderDetailsContainer = $('#orderDetails');
    orderDetailsContainer.empty();

    var orderName = $('<p>');
    orderName.append($('<b>').text(order.name)) 
    orderName.append($('<span>').text("'s Bestellung"));
    orderDetailsContainer.append(orderName);

    var orderIngredients = $('<p>');
    orderIngredients.text('Zutaten:');
    orderDetailsContainer.append(orderIngredients);

    let i = 0;
    var orderIngredientsList = $('<ul>');
    orderIngredientsList.addClass('list-group');
    while (i < order.zutaten.length) {
      orderIngredientsList.append($('<li>').addClass('list-group-item').text(order.zutaten[i]));
      i++;
    }
    orderDetailsContainer.append(orderIngredientsList);       

    var markAsDoneButton = $('<button>');
    markAsDoneButton.attr('type', 'button');
    markAsDoneButton.addClass('btn btn-success');
    markAsDoneButton.text('Bestellung erledigt');
    markAsDoneButton.click(function() {
      markOrderAsDone(order.id);
    });
    orderDetailsContainer.append(markAsDoneButton);
  }

  function markOrderAsDone(orderId) {
    var data = { order: orderId };

    $.ajax({
      url: 'http://localhost:8000/markAsDone',
      method: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(response) {
        console.log('Bestellung als erledigt markiert:', response);
        loadOrders(); // Aktualisiert die Bestellungen
        var orderDetailsContainer = $('#orderDetails');
        orderDetailsContainer.empty();
        if (orders.length > 0) displayOrderDetails(orders[0]);
        // location.reload();
      },
      error: function(xhr, status, error) {
        console.log('Fehler beim Markieren der Bestellung als erledigt:', error);
      }
    });
  }
});
