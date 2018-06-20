<?php

namespace EventManagerIntegration\Acf;

class AcfConfig
{
    public function __construct()
    {
        add_action('init', array($this, 'includeAcf'), 11);
        add_action('acf/init', array($this, 'acfSettings'));
    }

    /**
     * Notifies user to activate ACF PRO to get full expirience
     * @return void
     */
    public function includeAcf()
    {
        if (!class_exists('acf')) {
            add_action('admin_notices', function () {
                echo '<div class="notice error"><p>' .
                        __('To get the full expirience of the <strong>Event Manager Integration</strong> plugin, please activate the <a href="http://www.advancedcustomfields.com/pro/" target="_blank">Advanced Custom Fields Pro</a> plugin.', 'event-integration') .
                     '</p></div>';
            });
        }
    }

    /**
     * ACF settings action
     * @return void
     */
    public function acfSettings()
    {
        acf_update_setting('google_api_key', get_field('google_geocode_key', 'option'));
        // Disable loading Google Maps JS API with ACFs since we include it manually with additional libraries
        if (is_admin() && isset($_GET['page']) && $_GET['page'] === 'event-options') {
            acf_update_setting('enqueue_google_maps', false);
        }
    }
}
