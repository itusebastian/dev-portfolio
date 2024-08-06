<?php
// Configuración del correo
$to = "itusebastian@gmail.com"; // Cambia esto por la dirección de correo a la que quieres enviar el formulario
$subject = "Nuevo mensaje de contacto";

// Validar que el formulario fue enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir los datos del formulario
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject_form = strip_tags(trim($_POST["subject"]));
    $message = trim($_POST["message"]);
    $recaptcha_response = $_POST['g-recaptcha-response'];

    // Verificar que los campos no están vacíos
    if (empty($name) || empty($subject_form) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Por favor completa todos los campos y asegúrate de que el correo electrónico es válido.";
        exit;
    }

    // Verificar reCAPTCHA
    $recaptcha_secret = '6LfZM1QcAAAAAGNqoBYizL2nlhtmrkHp4yrEX3J4'; // Cambia esto por tu clave secreta de reCAPTCHA
    $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
    $recaptcha_data = array(
        'secret' => $recaptcha_secret,
        'response' => $recaptcha_response
    );

    $options = array(
        'http' => array(
            'method'  => 'POST',
            'content' => http_build_query($recaptcha_data)
        )
    );

    $context  = stream_context_create($options);
    $verify = file_get_contents($recaptcha_url, false, $context);
    $captcha_success = json_decode($verify);

    if ($captcha_success->success == false) {
        http_response_code(400);
        echo "Error en la verificación del reCAPTCHA.";
        exit;
    }

    // Construir el cuerpo del correo
    $email_content = "Nombre: $name\n";
    $email_content .= "Correo Electrónico: $email\n";
    $email_content .= "Asunto: $subject_form\n\n";
    $email_content .= "Mensaje:\n$message\n";

    // Configurar los encabezados del correo
    $headers = "From: $name <$email>";

    // Enviar el correo
    if (mail($to, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo "Gracias, tu mensaje ha sido enviado.";
    } else {
        http_response_code(500);
        echo "Oops, algo salió mal. Tu mensaje no pudo ser enviado.";
    }
} else {
    http_response_code(403);
    echo "Hubo un problema con tu envío, inténtalo de nuevo.";
}
?>
