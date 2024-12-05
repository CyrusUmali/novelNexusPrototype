<?php
require_once '../vendor/autoload.php'; // Adjust the path as needed

\Stripe\Stripe::setApiKey('sk_test_51QRZXgFxCsIfG670Nz9mQjLP8YpUTfk3D4uSHa5qi7TxyjkG5nVL4kNn77yTQaDznkkYbA3YlU3MVkoeIs8DGph900zhNc6tmM'); // Replace with your test secret key

header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $amount = $input['amount'];

    if ($amount <= 0) {
        throw new Exception('Invalid fine amount.');
    }

    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'php',
                'product_data' => [
                    'name' => 'Book Fines Payment'
                ],
                'unit_amount' => $amount * 100, // Convert amount to cents (Stripe expects amounts in the smallest currency unit)
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => 'http://localhost/library-group/db/php/user/payFines-api.php?amount=' . $amount,
        'cancel_url' => 'http://localhost/library-group/index.php?page=subscription',
    ]);

    echo json_encode(['id' => $session->id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
