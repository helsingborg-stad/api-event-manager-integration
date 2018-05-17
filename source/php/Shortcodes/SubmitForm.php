<?php

/**
 * Shortcodes to display event submit form
 */

namespace EventManagerIntegration\Shortcodes;

class SubmitForm
{
    public function __construct()
    {
        add_action('init', array($this, 'addShortcodes'));
    }

    /**
     * Create shortcode
     */
    public function addShortcodes()
    {
        add_shortcode('event_submit_form', function() {
            echo \EventManagerIntegration\Helper\RenderBlade::blade('submit-form');
        });
    }
}
