<?php

/**
 * Plugin Name:       Event Manager Integration
 * Plugin URI:        https://github.com/helsingborg-stad/api-event-manager-integration
 * Description:       Integrate and display events from Event Manager API.
 * Version: 2.0.18
 * Author:            Jonatan Hanson, Sebastian Thulin
 * Author URI:        http://www.helsingborg.se
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       event-integration
 * Domain Path:       /languages
 */

 // Protect agains direct file access
if (! defined('WPINC')) {
    die;
}

// Require composer dependencies (autoloader)
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Include vendor files
if (file_exists(dirname(ABSPATH) . '/vendor/autoload.php')) {
    require_once dirname(ABSPATH) . '/vendor/autoload.php';
}

define('EVENTMANAGERINTEGRATION_ID', '0.6.6');
define('EVENTMANAGERINTEGRATION_PATH', plugin_dir_path(__FILE__));
define('EVENTMANAGERINTEGRATION_URL', plugins_url('', __FILE__));
define('EVENTMANAGERINTEGRATION_VIEW_PATH', EVENTMANAGERINTEGRATION_PATH . 'views/');
define('EVENTMANAGERINTEGRATION_MODULE_VIEW_PATH', EVENTMANAGERINTEGRATION_PATH . 'source/php/Module/Event/views');
define('EVENTMANAGERINTEGRATION_SUBMIT_FORM_MODULE_VIEW_PATH', EVENTMANAGERINTEGRATION_PATH . 'source/php/Module/SubmitForm/views');
define('EVENTMANAGERINTEGRATION_EVENT_FORM_MODULE_VIEW_PATH', EVENTMANAGERINTEGRATION_PATH . 'source/php/Module/EventForm/views');
define('EVENTMANAGERINTEGRATION_CACHE_DIR', trailingslashit(wp_upload_dir()['basedir']) . 'cache/blade-cache/');

load_plugin_textdomain('event-integration', false, plugin_basename(dirname(__FILE__)) . '/languages');

// Autoload from plugin
if (file_exists(EVENTMANAGERINTEGRATION_PATH . 'vendor/autoload.php')) {
    require_once EVENTMANAGERINTEGRATION_PATH . 'vendor/autoload.php';
}
require_once EVENTMANAGERINTEGRATION_PATH . 'Public.php';

// Acf auto import and export
add_action('plugins_loaded', function () {
    $acfExportManager = new AcfExportManager\AcfExportManager();
    $acfExportManager->setTextdomain('event-integration');
    $acfExportManager->setExportFolder(EVENTMANAGERINTEGRATION_PATH . 'AcfFields/');
    $acfExportManager->autoExport(array(
        'event-module' 		 => 'group_583fe4ee88439',
        'location-module'	 => 'group_5948e8bc3bf75',
        'options' 			 => 'group_583557753bd73',
        'shortcodes' 		 => 'group_58526d565e1f5',
        'event-form-module'	 => 'group_5c599a27e446a',
        'options-debug-info' => 'group_61e13ea95de0e'
    ));
    $acfExportManager->import();
});

add_filter(
    '/Modularity/externalViewPath',
    function ($arr) {
        $arr['mod-event-submit'] = EVENTMANAGERINTEGRATION_EVENT_FORM_MODULE_VIEW_PATH;
        $arr['mod-event'] = EVENTMANAGERINTEGRATION_MODULE_VIEW_PATH;
        return $arr;
    },
    10,
    3
);

// Activation & deactivation hooks
register_activation_hook(plugin_basename(__FILE__), '\EventManagerIntegration\Cron::addCronJob');
register_deactivation_hook(plugin_basename(__FILE__), '\EventManagerIntegration\Cron::removeCronJob');

// Create database table when plugin is activated
register_activation_hook(plugin_basename(__FILE__), '\EventManagerIntegration\Install::createTables');

// Start application
new EventManagerIntegration\App();
