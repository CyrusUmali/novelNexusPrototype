<?php
require_once '../vendor/autoload.php'; // Adjust path as needed

\Stripe\Stripe::setApiKey('sk_test_51QRZXgFxCsIfG670Nz9mQjLP8YpUTfk3D4uSHa5qi7TxyjkG5nVL4kNn77yTQaDznkkYbA3YlU3MVkoeIs8DGph900zhNc6tmM'); // Replace with your secret key

header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $planId = $input['plan_id'];

    // Define plan details
    $planDetails = [
        2 => ['name' => 'Pro Plan', 'price' => 39900], // Price in cents (PHP 399.00)
        3 => ['name' => 'Elite Plan', 'price' => 69900] // Price in cents (PHP 699.00)
    ];

    if (!isset($planDetails[$planId])) {
        throw new Exception('Invalid plan selected.');
    }

    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => 'php',
                'product_data' => [
                    'name' => $planDetails[$planId]['name']
                ],
                'unit_amount' => $planDetails[$planId]['price'],
            ],
            'quantity' => 1,
        ]],
        'mode' => 'payment',
        'success_url' => 'http://localhost/library-group/db/php/user/userPlan-api.php?plan_id=' . $planId,
        'cancel_url' => 'http://localhost/library-group/index.php?page=pricing',
    ]);

    echo json_encode(['id' => $session->id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
