$(document).ready(function() {
  var sendButton = $('#orderButton');
  sendButton.click(sendOrder);

  function sendOrder(event) {
    event.preventDefault(); // Verhindert das Standard-Formularverhalten

    var name = $('#name').val();
    var zutaten = [];

    $('input[type=checkbox][name=zutaten]:checked').each(function() {
      zutaten.push($(this).val());
    });

    $('input[type=radio][name=zutaten]:checked').each(function() {
      zutaten.push($(this).val());
    });

    var order = {
      id: generateOrderId(), // Generiert eine eindeutige Bestellungs-ID
      name: name,
      zutaten: zutaten,
      done: false // Setzt den "done"-Status auf false (offen)
    };

    $.ajax({
      url: 'http://wok.scrimo.com/order',
      method: 'POST',
      data: JSON.stringify(order),
      contentType: 'application/json',
      success: function(response) {
        console.log('Bestellung erfolgreich gesendet:', response);
        document.getElementById("overlay").style.display = "block";
        setTimeout(() => {location.reload();}, 2000);
      },
      error: function(xhr, status, error) {
        console.log('Fehler beim Senden der Bestellung:', error);
        alert('Fehler beim Senden der Bestellung. Bitte versuchen Sie es erneut.');
      }
    });
  }

  function resetForm() {
    $('#name').val('');
    $('input[type=checkbox][name=zutaten]').prop('checked', false);
  }

  function generateOrderId() {
    // Generiert eine zufällige ID mit dem aktuellen Datum und Uhrzeit
    var timestamp = new Date().getTime();
    var random = Math.floor(Math.random() * 10000);
    return 'ORDER-' + timestamp + '-' + random;
  }
});
