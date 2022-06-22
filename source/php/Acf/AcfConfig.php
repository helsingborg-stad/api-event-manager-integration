<?php

namespace EventManagerIntegration\Acf;

class AcfConfig
{
    public function __construct()
    {
        add_action('init', array($this, 'includeAcf'), 11);
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
}
