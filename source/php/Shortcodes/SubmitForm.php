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
        add_shortcode('event_submit_form', array($this, 'submitFormCallback'));
    }

    /**
     * Return form markup
     * @param array $atts Attributes
     * @param string $content Content
     * @param string $tag Shortcode name
     * @return string Form markup
     */
    public function submitFormCallback($atts = [], $content = null, $tag = '')
    {
        // Normalize attribute keys, lowercase
        $atts = array_change_key_case((array)$atts, CASE_LOWER);

        // Override default attributes with user attributes
        $data = shortcode_atts([
            'user_groups' => '',
        ], $atts, $tag);

        return \EventManagerIntegration\Helper\RenderBlade::blade('submit-form', $data);
    }
}
