<?php

/**
 * Admin page with forms to authenticate with OAuth1 server
 */

namespace EventManagerIntegration\OAuth;

class OAuthAdmin
{
    public function __construct()
    {
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
}
