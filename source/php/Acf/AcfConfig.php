<?php

namespace EventManagerIntegration\Acf;

class AcfConfig
{
    public function __construct()
    {
        add_action('init', function () {
            if (!file_exists(WP_CONTENT_DIR . '/mu-plugins/AcfImportCleaner.php') && !class_exists('\\AcfImportCleaner\\AcfImportCleaner')) {
                require_once EVENTMANAGERINTEGRATION_PATH . 'source/php/Helper/AcfImportCleaner.php';
            }
        });
        add_action('init', array($this, 'includeAcf'), 11);
        //Remove jsonLoadPath when loading acf with php
        //add_filter('acf/settings/load_json', array($this, 'jsonLoadPath'));
        add_action('acf/init', array($this, 'acfSettings'));
        add_filter('acf/translate_field', array($this, 'acfTranslationFilter'));
    }

    /**
     * Notifies user to activate ACF PRO to get full expirience
     * @return void
     */
    public function includeAcf()
    {
        if (!is_plugin_active('advanced-custom-fields-pro/acf.php')) {
            add_action('admin_notices', function () {
                echo '<div class="notice error"><p>' .
                        __('To get the full expirience of the <strong>Event Manager Integration</strong> plugin, please activate the <a href="http://www.advancedcustomfields.com/pro/" target="_blank">Advanced Custom Fields Pro</a> plugin.', 'event-integration') .
                     '</p></div>';
            });
        }
    }

    public function jsonLoadPath($paths)
    {
        $paths[] = EVENTMANAGERINTEGRATION_PATH . '/acf-exports';
        return $paths;
    }

    /**
     * ACF settings action
     * @return void
     */
    public function acfSettings()
    {
        acf_update_setting('l10n', true);
        acf_update_setting('l10n_textdomain', 'event-integration');
    }

    /**
     * ACF filter to translate specific fields when exporting to PHP
     * @param  array fields to be translated
     * @return array updated fields list
     */
    public function acfTranslationFilter($field)
    {
        if ($field['type'] == 'text' || $field['type'] == 'number') {
            $field['append'] = acf_translate($field['append']);
            $field['placeholder'] = acf_translate($field['placeholder']);
        }

        if ($field['type'] == 'textarea') {
            $field['placeholder'] = acf_translate($field['placeholder']);
        }

        if ($field['type'] == 'repeater') {
            $field['button_label'] = acf_translate($field['button_label']);
        }
        return $field;
    }
}
