<?php

declare(strict_types=1);

/**
 * OAuth1 functions to authenticate clients and publish to wp rest api
 */

namespace EventManagerIntegration\OAuth;

class OAuthRequests
{
    public function __construct()
    {
        $event = 'event';
        $organizer = 'organizer';
        $location = 'location';

        add_action('wp_ajax_request_oauth', array($this, 'requestOAuth'));
        add_action('wp_ajax_access_oauth', array($this, 'accessOAuth'));
        add_action('wp_ajax_delete_oauth', array($this, 'deleteOAuth'));
        add_action('wp_ajax_nopriv_submit_image', array($this, 'submitImage'));
        add_action('wp_ajax_submit_image', array($this, 'submitImage'));

        add_action('wp_ajax_submit_event', function () use ($event) {
            $this->submitEvent($event);
        });

        add_action('wp_ajax_nopriv_submit_event', function () use ($event) {
            $this->submitEvent($event);
        });

        add_action('wp_ajax_submit_organizer', function () use ($organizer) {
            $this->submitEvent($organizer);
        });

        add_action('wp_ajax_nopriv_submit_organizer', function () use ($organizer) {
            $this->submitEvent($organizer);
        });

        add_action('wp_ajax_submit_location', function () use ($location) {
            $this->submitEvent($location);
        });

        add_action('wp_ajax_nopriv_submit_location', function () use ($location) {
            $this->submitEvent($location);
        });
    }

    /**
     * OAuth1 verification step 1: Send a request to API with client keys. Return verification URL if succeeded.
     * OAuth1 verification step 2 (handled on the OAuth1 server): User authorizes the client from the verification URL and will be given a verifier key,
     * that will be used in step 3
     * @return void
     */
    public function requestOAuth()
    {
        if (!isset($_POST['client']) || !isset($_POST['secret']) || empty($_POST['client']) || empty($_POST['secret'])) {
            wp_send_json_error(__('Request credentials is missing', 'event-integration'));
        }

        // Skip SSL verification while DEV_MODE is true
        $options = array(
            'ssl' => array(
                'verify_peer' => defined('DEV_MODE') && DEV_MODE === true ? false : true,
                'verify_peer_name' => defined('DEV_MODE') && DEV_MODE === true ? false : true,
            ),
        );

        $consumerKey = $_POST['client'];
        $consumerSecret = $_POST['secret'];
        // Get API base url
        $apiOauthUrl = get_field('event_api_oauth_url', 'option');
        if (!$apiOauthUrl) {
            wp_send_json_error(__('You must enter OAuth1 endpoint url found under Event settings to proceed.', 'event-integration'));
        }
        $url = rtrim($apiOauthUrl, '/');
        $requestTokenUrl = $url . '/request';
        $authorizeUrl = $url . '/authorize';
        $oauthTimestamp = time();
        $nonce = md5(mt_rand());
        $oauthSignatureMethod = 'HMAC-SHA1';
        $oauthVersion = '1.0';
        // Create OAuth signature base string
        $sigBase = 'GET&' . rawurlencode($requestTokenUrl) . '&' . rawurlencode('oauth_consumer_key=' . rawurlencode($consumerKey) . '&oauth_nonce=' . rawurlencode($nonce) . '&oauth_signature_method=' . rawurlencode($oauthSignatureMethod) . '&oauth_timestamp=' . $oauthTimestamp . '&oauth_version=' . $oauthVersion);
        // URL encode consumer secret key to bo used in signature
        $sigKey = rawurlencode($consumerSecret) . '&';
        // Signature = HMAC-SHA1 hash base string + key
        $oauthSig = base64_encode(hash_hmac('sha1', $sigBase, $sigKey, true));
        // Create OAuth request url with our signature
        $requestUrl = $requestTokenUrl . '?' . 'oauth_consumer_key=' . rawurlencode($consumerKey) . '&oauth_nonce=' . rawurlencode($nonce) . '&oauth_signature_method=' . rawurlencode($oauthSignatureMethod) . '&oauth_timestamp=' . rawurlencode($oauthTimestamp) . '&oauth_version=' . rawurlencode($oauthVersion) . '&oauth_signature=' . rawurlencode($oauthSig);
        // Get results from request
        $response = file_get_contents($requestUrl, false, stream_context_create($options));

        // Return error message if request failed
        if ($response === false) {
            wp_send_json_error(__('The credentials you supplied were not correct', 'event-integration'));
        }

        parse_str(trim($response), $values);

        // Save client keys and temporary tokens to db
        update_option('_event_client', $consumerKey);
        update_option('_event_secret', $consumerSecret);
        update_option('_temp_request_token', $values['oauth_token']);
        update_option('_temp_request_token_secret', $values['oauth_token_secret']);

        $verificationUrl = $authorizeUrl . '?oauth_token=' . $values['oauth_token'];

        // Return JSON response with verification url
        $data = array('message' => __('Request succeeded!', 'event-integration'), 'url' => '<a href="' . $verificationUrl . '" target="_blank">' . __('Click here to authorize this client and get verification token', 'event-integration') . '</a>');
        wp_send_json_success($data);
    }

    /**
     * OAuth1 verification step 3: Request access to API and save returned tokens if succeeded.
     * @return void
     */
    public function accessOAuth()
    {
        if (!isset($_POST['verifier']) || empty($_POST['verifier'])) {
            wp_send_json_error(__('Verifier is missing', 'event-integration'));
        }

        // Skip SSL verification while DEV_MODE is true
        $options = array(
            'ssl' => array(
                'verify_peer' => defined('DEV_MODE') && DEV_MODE === true ? false : true,
                'verify_peer_name' => defined('DEV_MODE') && DEV_MODE === true ? false : true,
            ),
        );

        $oauthVerifier = $_POST['verifier'];
        $consumerKey = get_option('_event_client');
        $consumerSecret = get_option('_event_secret');

        // Get API base url
        $apiOauthUrl = get_field('event_api_oauth_url', 'option');
        $url = rtrim($apiOauthUrl, '/');
        $accessTokenUrl = $url . '/access';
        $oauthVersion = '1.0';
        $oauthSignatureMethod = 'HMAC-SHA1';
        $nonce = md5(mt_rand());
        $oauthTimestamp = time();

        $sigBase = 'GET&' . rawurlencode($accessTokenUrl) . '&' . rawurlencode('oauth_consumer_key=' . rawurlencode($consumerKey) . '&oauth_nonce=' . rawurlencode($nonce) . '&oauth_signature_method=' . rawurlencode($oauthSignatureMethod) . '&oauth_timestamp=' . rawurlencode($oauthTimestamp) . '&oauth_token=' . rawurlencode(get_option('_temp_request_token')) . '&oauth_verifier=' . rawurlencode($oauthVerifier) . '&oauth_version=' . rawurlencode($oauthVersion));

        $sigKey = rawurlencode($consumerSecret) . '&' . rawurlencode(get_option('_temp_request_token_secret'));
        $oauthSig = base64_encode(hash_hmac('sha1', $sigBase, $sigKey, true));

        $requestUrl = $accessTokenUrl . '?' . 'oauth_consumer_key=' . rawurlencode($consumerKey) . '&oauth_nonce=' . rawurlencode($nonce) . '&oauth_signature_method=' . rawurlencode($oauthSignatureMethod) . '&oauth_timestamp=' . rawurlencode($oauthTimestamp) . '&oauth_token=' . rawurlencode(get_option('_temp_request_token')) . '&oauth_verifier=' . rawurlencode($oauthVerifier) . '&oauth_version=' . rawurlencode($oauthVersion) . '&oauth_signature=' . rawurlencode($oauthSig);

        $response = file_get_contents($requestUrl, false, stream_context_create($options));
        // Return error message if request failed
        if ($response === false) {
            wp_send_json_error(__('The verifier you supplied were not correct', 'event-integration'));
        }

        parse_str(trim($response), $values);
        // Save new tokens to db
        update_option('_event_token', $values['oauth_token']);
        update_option('_event_token_secret', $values['oauth_token_secret']);
        update_option('_event_authorized', true);
        // Remove temporary tokens
        delete_option('_temp_request_token');
        delete_option('_temp_request_token_secret');

        wp_send_json_success(__('You are authorized!', 'event-integration'));
    }

    /**
     * Submit an event to Event Manager API
     */
    public function submitEvent($type)
    {
        if (!isset($_POST['data'])) {
            wp_send_json_error(__('Form data is missing, please try again.', 'event-integration'), 'event-integration');
        }

        $postData = $this->sanitizeInput($_POST['data']);
        // Add consumer name to postData
        $clientUrl = parse_url(get_site_url());
        $postData['consumer_client'] = !empty($postData['client_name']) ? $clientUrl['host'] . ' - ' . $postData['client_name'] : $clientUrl['host'];
        $postData = json_encode($postData);
        $consumerKey = get_option('_event_client');
        $consumerSecret = get_option('_event_secret');
        $accessToken = get_option('_event_token');
        $accessTokenSecret = get_option('_event_token_secret');
        $oauthVersion = '1.0';
        $apiUrl = rtrim(get_field('event_api_url', 'option'), '/');
        $apiResourceUrl = $apiUrl . '/' . $type;
        $nonce = md5(mt_rand());
        $oauthSignatureMethod = 'HMAC-SHA1';
        $oauthTimestamp = time();

        $sigBase = 'POST&' . rawurlencode($apiResourceUrl) . '&' . rawurlencode('oauth_consumer_key=' . rawurlencode($consumerKey) . '&oauth_nonce=' . rawurlencode($nonce) . '&oauth_signature_method=' . rawurlencode($oauthSignatureMethod) . '&oauth_timestamp=' . $oauthTimestamp . '&oauth_token=' . rawurlencode($accessToken) . '&oauth_version=' . rawurlencode($oauthVersion));
        $sigKey = rawurlencode($consumerSecret) . '&' . rawurlencode($accessTokenSecret);
        $oauthSig = base64_encode(hash_hmac('sha1', $sigBase, $sigKey, true));
        $authHeader = 'OAuth oauth_consumer_key=' . rawurlencode($consumerKey) . ',' . 'oauth_nonce=' . rawurlencode($nonce) . ',' . 'oauth_signature_method=' . rawurlencode($oauthSignatureMethod) . ',' . 'oauth_signature=' . rawurlencode($oauthSig) . ',' . 'oauth_timestamp=' . rawurlencode($oauthTimestamp) . ',' . 'oauth_token=' . rawurlencode($accessToken) . ',' . 'oauth_version=' . rawurlencode($oauthVersion);

        // Make the request
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiResourceUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, defined('DEV_MODE') && DEV_MODE === true ? false : 2);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, defined('DEV_MODE') && DEV_MODE === true ? false : 2);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-type: application/json',
            'Authorization: OAuth ' . $authHeader,
        ));

        $output = curl_exec($ch);
        $output = json_decode($output);

        // Get Http code
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Return response
        if ($httpCode === 201) {
            // Event was created
            wp_send_json_success($output);
        } else {
            // Something went wrong
            if (defined('DEV_MODE') && DEV_MODE === true) {
                wp_send_json_error(
                    [
                        'message' => __('Something went wrong posting the event', 'event-integration'),
                        'error' => error_get_last()['message'] ?? '',
                        'response' => $output,
                    ],
                );
            } else {
                wp_send_json_error(__('Something went wrong posting the event', 'event-integration'));
            }
        }
    }

    /**
     * Upload image to Event Manager API media end point
     */
    public function submitImage()
    {
        if (!isset($_FILES['file'])) {
            wp_send_json_error(__('Image is not selected, please try again.', 'event-integration'), 'event-integration');
        }

        $endPoint = '/media';
        $consumerKey = get_option('_event_client');
        $consumerSecret = get_option('_event_secret');
        $accessToken = get_option('_event_token');
        $accessTokenSecret = get_option('_event_token_secret');
        $oauthVersion = '1.0';
        $apiUrl = rtrim(get_field('event_api_url', 'option'), '/');
        $apiResourceUrl = $apiUrl . $endPoint;
        $nonce = md5(mt_rand());
        $oauthSignatureMethod = 'HMAC-SHA1';
        $oauthTimestamp = time();

        // Create multipart content body. Holds media to be uploaded
        $eol = "\r\n";
        define('MULTIPART_BOUNDARY', '--------------------------' . microtime(true));
        $fileContents = file_get_contents($_FILES['file']['tmp_name']);
        $content = '--' . MULTIPART_BOUNDARY . $eol . "Content-Disposition: form-data; name=\"file\"; filename=\"" . rawurlencode($_FILES['file']['name']) . "\"" . $eol . 'Content-Type: ' . $_FILES['file']['type'] . $eol . $eol . $fileContents . $eol;
        $content .= '--' . MULTIPART_BOUNDARY . '--' . $eol;

        $sigBase = 'POST&' . rawurlencode($apiResourceUrl) . '&' . rawurlencode('oauth_consumer_key=' . rawurlencode($consumerKey) . '&oauth_nonce=' . rawurlencode($nonce) . '&oauth_signature_method=' . rawurlencode($oauthSignatureMethod) . '&oauth_timestamp=' . $oauthTimestamp . '&oauth_token=' . rawurlencode($accessToken) . '&oauth_version=' . rawurlencode($oauthVersion));
        $sigKey = rawurlencode($consumerSecret) . '&' . rawurlencode($accessTokenSecret);
        $oauthSig = base64_encode(hash_hmac('sha1', $sigBase, $sigKey, true));
        $authHeader = 'OAuth oauth_consumer_key=' . rawurlencode($consumerKey) . ',' . 'oauth_nonce=' . rawurlencode($nonce) . ',' . 'oauth_signature_method=' . rawurlencode($oauthSignatureMethod) . ',' . 'oauth_signature=' . rawurlencode($oauthSig) . ',' . 'oauth_timestamp=' . rawurlencode($oauthTimestamp) . ',' . 'oauth_token=' . rawurlencode($accessToken) . ',' . 'oauth_version=' . rawurlencode($oauthVersion);

        $context = stream_context_create(array(
            'http' => array(
                'method' => 'POST',
                'header' => 'Content-Type: multipart/form-data; boundary=' . MULTIPART_BOUNDARY . $eol . "Content-Disposition: attachment filename=\"" . rawurlencode($_FILES['file']['name']) . "\"\r\n" . 'Authorization: ' . $authHeader . $eol,
                'content' => $content,
            ),
            'ssl' => array(
                'verify_peer' => defined('DEV_MODE') && DEV_MODE === true ? false : true,
                'verify_peer_name' => defined('DEV_MODE') && DEV_MODE === true ? false : true,
            ),
        ));

        $result = file_get_contents($apiResourceUrl, false, $context);

        if ($result === false) {
            wp_send_json_error(
                __('Something went wrong uploading your image', 'event-integration') . ': ' . (error_get_last()['message'] ?? ''),
            );
        }

        // return uploaded media id
        $resObj = json_decode($result);
        wp_send_json_success($resObj->id);
    }

    /**
     * Remove all client tokens
     */
    public function deleteOAuth()
    {
        delete_option('_event_authorized');
        delete_option('_event_client');
        delete_option('_event_secret');
        delete_option('_event_token');
        delete_option('_event_token_secret');
        delete_option('_temp_request_token');
        delete_option('_temp_request_token_secret');

        echo 'Client removed';
        wp_die();
    }

    /**
     * Sanitize array with input data
     * @param  array &$array Defualt array
     * @return array         Sanitized array
     */
    public function sanitizeInput(&$array)
    {
        foreach ($array as $key => &$value) {
            if (!is_array($value)) {
                if ($key == 'content') {
                    $value = sanitize_textarea_field($value);
                } else {
                    $value = sanitize_text_field($value);
                }
            } else {
                $this->sanitizeInput($value);
            }
        }

        return $array;
    }
}
