<?php

/**
 * OAuth1 functions to authenticate clients and publish to wp rest api
 */

namespace EventManagerIntegration\OAuth;

class OAuthHandler
{
    public function __construct()
    {
        add_action('wp_ajax_request_oauth', array($this, 'requestOAuth'));
        add_action('wp_ajax_access_oauth', array($this, 'accessOAuth'));
        add_action('wp_ajax_delete_oauth', array($this, 'deleteOAuth'));
        add_action('wp_ajax_nopriv_submit_event', array($this, 'submitEvent'));
        add_action('wp_ajax_submit_event', array($this, 'submitEvent'));
        add_action('wp_ajax_nopriv_submit_image', array($this, 'submitImage'));
        add_action('wp_ajax_submit_image', array($this, 'submitImage'));
        add_action('admin_menu', array($this, 'createOauthPage'));
    }

    /**
     * Adds submenu page "API authentication", under custom post type parent.
     */
    function createOauthPage() {
        add_submenu_page(
            'edit.php?post_type=event',
            __( 'API authentication', 'event-integration' ),
            __( 'API authentication', 'event-integration' ),
            'manage_options',
            'oauth-request',
            array($this, 'oauthRequestCallback')
        );
    }

    /**
     * Callback for the submenu page. Forms to complete authorization.
     */
    function oauthRequestCallback() {
        ?>
        <div class="wrap">
            <h1><?php _e('API authentication', 'event-integration' ); ?></h1>
        </div>

        <div class="error notice hidden"></div>
        <div class="updated notice hidden"></div>

        <?php if (get_option('_event_authorized') == false): ?>
        <div class="wrap oauth-request">
        <h3><?php _e('Request authorization', 'event-integration'); ?></h3>
        <p><?php _e('To publish events from this client to the API you need authentication. Enter your given client keys and send request.', 'event-integration' ); ?></p>
            <form method="post" id="oauth-request" action="/wp-admin/admin-ajax.php">
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="client-key"><?php _e( 'Client key', 'event-integration' )?></label>
                        </th>
                        <td>
                            <input type="text" class="client-key" name="client-key" id="client-key" value="<?php echo esc_attr(get_option('_event_client')); ?>" />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="client-secret"><?php _e( 'Client secret', 'event-integration' )?></label>
                        </th>
                        <td>
                            <input type="text" class="client-secret" name="client-secret" id="client-secret" value="<?php echo esc_attr(get_option('_event_secret')); ?>" />
                        </td>
                    </tr>
                </table>
                <p class="submit">
                    <input name='submit' type='submit' id='oauth-request-submit' class='button-primary' value='<?php _e('Send request', 'event-integration') ?>' />
                </p>
            </form>
        </div>

        <div class="wrap oauth-access">
        <h3><?php _e('Enter verification token', 'event-integration'); ?></h3>
            <form method="post" id="oauth-access" action="/wp-admin/admin-ajax.php">
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="verification-token"><?php _e('Verification token', 'event-integration'); ?></label>
                        </th>
                        <td>
                            <input type="text" class="verification-token" name="verification-token" id="verification-token"/>
                        </td>
                    </tr>
                </table>
                <p class="submit">
                    <input name='submit' type='submit' class='button-primary' value='<?php _e('Grant access', 'event-integration');  ?>' />
                </p>
            </form>
        </div>
        <?php endif ?>

        <?php if (get_option('_event_authorized') == true): ?>
        <div class="wrap oauth-authorized">
        <h3 class="message-success"><?php _e('Authorized', 'event-integration' ); ?></h3>
        <p><?php _e('This client is authorized to submit events to the API.', 'event-integration' ); ?></p>
            <form method="post" id="oauth-authorized" action="/wp-admin/admin-ajax.php">
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <?php _e( 'Client key', 'event-integration' ); ?>
                        </th>
                        <td>
                            <code>
                                <?php echo get_option('_event_client'); ?>
                            </code>
                        </td>
                    </tr>
                </table>
            <p class="submit">
                <input name='submit' type='submit' class='button' value='<?php _e('Remove client', 'event-integration') ?>' />
            </p>
            </form>
        </div>
        <?php endif ?>
    <?php
    }

    /**
     * Remove all client tokens
     */
    function deleteOAuth()
    {
        delete_option('_event_authorized');
        delete_option('_event_client');
        delete_option('_event_secret');
        delete_option('_event_token');
        delete_option('_event_token_secret');
        delete_option('_temp_request_token');
        delete_option('_temp_request_token_secret');

        echo "Client removed";
        wp_die();
    }

    /**
     * OAuth1 verification step 1: Send a request to API with client keys. Return verification URL if succeeded.
     * OAuth1 verification step 2 (handled on the OAuth1 server): User authorizes the client from the verification URL and will be given a verifier key,
     * that will be used in step 3
     * @return string
     */
    public function requestOAuth()
    {
        if ( (!isset($_POST['client'])) || (!isset($_POST['secret'])) || (empty($_POST['client'])) || (empty($_POST['secret'])) ) {
            wp_send_json_error(__('Request credentials is missing', 'event-integration'));
        }

        $consumerKey = $_POST['client'];
        $consumerSecret = $_POST['secret'];
        // Get API base url
        $apiOauthUrl = get_field('event_api_oauth_url', 'option');
        if (! $apiOauthUrl) {
            wp_send_json_error(__('You must enter OAuth1 endpoint url found under Event settings to proceed.', 'event-integration'));
        }
        $url                  = rtrim($apiOauthUrl, '/');
        $requestTokenUrl      = $url . "/request";
        $authorizeUrl         = $url . "/authorize";
        $oauthTimestamp       = time();
        $nonce                = md5(mt_rand());
        $oauthSignatureMethod = "HMAC-SHA1";
        $oauthVersion         = "1.0";
        // Create OAuth signature base string
        $sigBase = "GET&" . rawurlencode($requestTokenUrl) . "&"
            . rawurlencode("oauth_consumer_key=" . rawurlencode($consumerKey)
            . "&oauth_nonce=" . rawurlencode($nonce)
            . "&oauth_signature_method=" . rawurlencode($oauthSignatureMethod)
            . "&oauth_timestamp=" . $oauthTimestamp
            . "&oauth_version=" . $oauthVersion);
        // URL encode consumer secret key to bo used in signature
        $sigKey = rawurlencode($consumerSecret) . "&";
        // Signature = HMAC-SHA1 hash base string + key
        $oauthSig = base64_encode(hash_hmac("sha1", $sigBase, $sigKey, true));
        // Create OAuth request url with our signature
        $requestUrl = $requestTokenUrl . "?"
            . "oauth_consumer_key=" . rawurlencode($consumerKey)
            . "&oauth_nonce=" . rawurlencode($nonce)
            . "&oauth_signature_method=" . rawurlencode($oauthSignatureMethod)
            . "&oauth_timestamp=" . rawurlencode($oauthTimestamp)
            . "&oauth_version=" . rawurlencode($oauthVersion)
            . "&oauth_signature=" . rawurlencode($oauthSig);
        // Get results from request
        $response = file_get_contents($requestUrl);
        // Return error message if request failed
        if ($response === false) {
            wp_send_json_error(__('The credentials you supplied were not correct', 'event-integration'));
        }

        parse_str(trim($response), $values);

        // Save client keys and temporary tokens to db
        $user_id = get_current_user_id();
        update_option('_event_client', $consumerKey);
        update_option('_event_secret', $consumerSecret);
        update_option('_temp_request_token', $values["oauth_token"]);
        update_option('_temp_request_token_secret', $values["oauth_token_secret"]);

        $verificationUrl = $authorizeUrl . "?oauth_token=" . $values["oauth_token"];

        // Return JSON response with verification url
        $data = array("message" => __('Request succeeded!', 'event-integration'), "url" => '<a href="' . $verificationUrl . '" target="_blank">' . __('Click here to authorize this client and get verification token', 'event-integration') . '</a>');
        wp_send_json_success($data);
    }

    /**
     * OAuth1 verification step 3: Request access to API and save returned tokens if succeeded.
     * @return string
     */
    public function accessOAuth()
    {
        if ( (!isset($_POST['verifier'])) || (empty($_POST['verifier'])) ) {
            wp_send_json_error(__('Verifier is missing', 'event-integration'));
        }
        $oauthVerifier = $_POST['verifier'];
        $consumerKey = get_option('_event_client');
        $consumerSecret = get_option('_event_secret');

        // Get API base url
        $apiOauthUrl          = get_field('event_api_oauth_url', 'option');
        $url                  = rtrim($apiOauthUrl, '/');
        $accessTokenUrl       = $url."/access";
        $oauthVersion         = "1.0";
        $oauthSignatureMethod = "HMAC-SHA1";
        $nonce                = md5(mt_rand());
        $oauthTimestamp       = time();

        $sigBase = "GET&" . rawurlencode($accessTokenUrl) . "&"
            . rawurlencode("oauth_consumer_key=" . rawurlencode($consumerKey)
            . "&oauth_nonce=" . rawurlencode($nonce)
            . "&oauth_signature_method=" . rawurlencode($oauthSignatureMethod)
            . "&oauth_timestamp=" . rawurlencode($oauthTimestamp)
            . "&oauth_token=" . rawurlencode(get_option('_temp_request_token'))
            . "&oauth_verifier=" . rawurlencode($oauthVerifier)
            . "&oauth_version=" . rawurlencode($oauthVersion));

        $sigKey = rawurlencode($consumerSecret) . "&" . rawurlencode(get_option('_temp_request_token_secret'));
        $oauthSig = base64_encode(hash_hmac("sha1", $sigBase, $sigKey, true));

        $requestUrl = $accessTokenUrl . "?"
            . "oauth_consumer_key=" . rawurlencode($consumerKey)
            . "&oauth_nonce=" . rawurlencode($nonce)
            . "&oauth_signature_method=" . rawurlencode($oauthSignatureMethod)
            . "&oauth_timestamp=" . rawurlencode($oauthTimestamp)
            . "&oauth_token=" . rawurlencode(get_option('_temp_request_token'))
            . "&oauth_verifier=" . rawurlencode($oauthVerifier)
            . "&oauth_version=". rawurlencode($oauthVersion)
            . "&oauth_signature=" . rawurlencode($oauthSig);

        $response = file_get_contents($requestUrl);
        // Return error message if request failed
        if ($response === false) {
            wp_send_json_error(__('The verifier you supplied were not correct', 'event-integration'));
        }

        parse_str(trim($response), $values);
        // Save new tokens to db
        update_option('_event_token',  $values["oauth_token"]);
        update_option('_event_token_secret', $values["oauth_token_secret"]);
        update_option('_event_authorized', true);
        // Remove temporary tokens
        delete_option('_temp_request_token');
        delete_option('_temp_request_token_secret');

        wp_send_json_success(__('You are authorized!', 'event-integration'));
    }

    /**
     * Submit an event to Event Manager API
     */
    public function submitEvent() {
        if (! isset($_POST['data'])) {
            wp_send_json_error(__('Form data is missing, please try again.', 'event-integration'), 'event-integration');
        }

        $postData                    = $_POST['data'];
        // Add consumer name to postData
        $clientUrl                   = parse_url(get_site_url());
        $postData['consumer_client'] = $clientUrl['host'];
        $postData                    = json_encode($postData);
        $consumerKey                 = get_option('_event_client');
        $consumerSecret              = get_option('_event_secret');
        $accessToken                 = get_option('_event_token');
        $accessTokenSecret           = get_option('_event_token_secret');
        $oauthVersion                = "1.0";
        $apiUrl                      = rtrim(get_field('event_api_url', 'option'), '/');
        $apiResourceUrl              = $apiUrl . '/event';
        $nonce                       = md5(mt_rand());
        $oauthSignatureMethod        = "HMAC-SHA1";
        $oauthTimestamp              = time();

        $sigBase = "POST&" . rawurlencode($apiResourceUrl) . "&"
            . rawurlencode("oauth_consumer_key=" . rawurlencode($consumerKey)
            . "&oauth_nonce=" . rawurlencode($nonce)
            . "&oauth_signature_method=" . rawurlencode($oauthSignatureMethod)
            . "&oauth_timestamp=" . $oauthTimestamp
            . "&oauth_token=" . rawurlencode($accessToken)
            . "&oauth_version=" . rawurlencode($oauthVersion));
        $sigKey = rawurlencode($consumerSecret) . "&" . rawurlencode($accessTokenSecret);
        $oauthSig = base64_encode(hash_hmac("sha1", $sigBase, $sigKey, true));
        $authHeader = "OAuth oauth_consumer_key=" . rawurlencode($consumerKey) . ","
            . "oauth_nonce=" . rawurlencode($nonce) . ","
            . "oauth_signature_method=" . rawurlencode($oauthSignatureMethod) . ","
            . "oauth_signature=" . rawurlencode($oauthSig) . ","
            . "oauth_timestamp=". rawurlencode($oauthTimestamp) . ","
            . "oauth_token=" . rawurlencode($accessToken) . ","
            . "oauth_version=" . rawurlencode($oauthVersion);

        $context = stream_context_create(array("http" => array(
            "method" => "POST",
            "header" => "Content-type: application/json\r\n"
                        . "Authorization: " . $authHeader . "\r\n",
            "content" => $postData
            )));

        $result = file_get_contents($apiResourceUrl, false, $context);
        if ($result === false) {
            wp_send_json_error(__('Something went wrong posting the event', 'event-integration'));
        }

        // return success results
        wp_send_json_success($result);
    }


    /**
     * Upload image to Event Manager API media end point
     */
    public function submitImage() {
        if (! isset($_FILES['file'])) {
            wp_send_json_error(__('Image is not selected, please try again.', 'event-integration'), 'event-integration');
        }

        $endPoint             = '/media';
        $consumerKey          = get_option('_event_client');
        $consumerSecret       = get_option('_event_secret');
        $accessToken          = get_option('_event_token');
        $accessTokenSecret    = get_option('_event_token_secret');
        $oauthVersion         = "1.0";
        $apiUrl               = rtrim(get_field('event_api_url', 'option'), '/');
        $apiResourceUrl       = $apiUrl . $endPoint;
        $nonce                = md5(mt_rand());
        $oauthSignatureMethod = "HMAC-SHA1";
        $oauthTimestamp       = time();

        // Create multipart content body. Holds media to be uploaded
        $eol = "\r\n";
        define('MULTIPART_BOUNDARY', '--------------------------'.microtime(true));
        $fileContents = file_get_contents($_FILES['file']['tmp_name']);
        $content =  "--" . MULTIPART_BOUNDARY . $eol .
                    "Content-Disposition: form-data; name=\"file\"; filename=\"".rawurlencode($_FILES['file']['name'])."\"". $eol .
                    "Content-Type: " . $_FILES['file']['type']. $eol . $eol .
                    $fileContents . $eol;
        $content .= "--" . MULTIPART_BOUNDARY . "--" . $eol;

        $sigBase = "POST&" . rawurlencode($apiResourceUrl) . "&"
            . rawurlencode("oauth_consumer_key=" . rawurlencode($consumerKey)
            . "&oauth_nonce=" . rawurlencode($nonce)
            . "&oauth_signature_method=" . rawurlencode($oauthSignatureMethod)
            . "&oauth_timestamp=" . $oauthTimestamp
            . "&oauth_token=" . rawurlencode($accessToken)
            . "&oauth_version=" . rawurlencode($oauthVersion)
         );
        $sigKey = rawurlencode($consumerSecret) . "&" . rawurlencode($accessTokenSecret);
        $oauthSig = base64_encode(hash_hmac("sha1", $sigBase, $sigKey, true));
        $authHeader = "OAuth oauth_consumer_key=" . rawurlencode($consumerKey) . ","
            . "oauth_nonce=" . rawurlencode($nonce) . ","
            . "oauth_signature_method=" . rawurlencode($oauthSignatureMethod) . ","
            . "oauth_signature=" . rawurlencode($oauthSig) . ","
            . "oauth_timestamp=". rawurlencode($oauthTimestamp) . ","
            . "oauth_token=" . rawurlencode($accessToken) . ","
            . "oauth_version=" . rawurlencode($oauthVersion);

        $context = stream_context_create(array("http" => array(
            'method' => 'POST',
            'header' => 'Content-Type: multipart/form-data; boundary=' . MULTIPART_BOUNDARY . $eol
                            . "Content-Disposition: attachment filename=\"" . rawurlencode($_FILES['file']['name']) . "\"\r\n"
                            . "Authorization: " . $authHeader . $eol,
                        'content' => $content
            )));

        $result = file_get_contents($apiResourceUrl, false, $context);

        if ($result === false) {
            wp_send_json_error(__('Something went wrong uploading your image', 'event-integration'));
        }

        // return uploaded media id
        $resObj = json_decode($result);
        wp_send_json_success($resObj->id);
    }

}
